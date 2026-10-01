import type { Client, Item } from 'archipelago.js'
import {
    GACGamemode,
    GACMap,
    GACMedal,
    GeoguessrGameStatus,
    SoundEffectType,
} from '../common/models.ts'

import {
    AreaItems,
    AreaLocations,
    AreaMap,
    mapsConfig,
    medalThresholds,
    ITEMS_PER_MAP
} from '../common/config.ts'

import { apClient } from './index.ts'
import { SendSoundEffectMessage, type GenerateGameMessage, type RoundFinishedMessage } from '../common/messages.ts'

export async function generateGame(mapId: string, gamemode: GACGamemode): Promise<string> {
    const response = await fetch(
        "https://www.geoguessr.com/api/v3/games",
        {
            method: "POST",
            body: JSON.stringify({
                map: mapId,
                timeLimit: 0,
                forbidMoving: !(gamemode & GACGamemode.Move),
                forbidZooming: !(gamemode & GACGamemode.Zoom),
                forbidRotating: !(gamemode & GACGamemode.Pan),
                type: "standard"
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }
    )

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: "${response.statusText}" (${response.url})`)
    }

    const responseJson = await response.json()
    const gameId = responseJson["token"]
    return gameId
}

export async function handleGenerateGameMessage(message: GenerateGameMessage) {
    console.debug("Received GenerateGameMessage:", message)
    const map = globalThis.gameState.maps.find((m: GACMap) => m.id === message.mapId)
    if (map === undefined) {
        throw new Error(`No map with id ${message.mapId} found`)
    }

    const gameId = await generateGame(map.id, map.gamemode)
    const _newTab = await browser.tabs.create({
        url: `https://www.geoguessr.com/game/${gameId}`
    })
}

export function isMapAvailable(areaMap: AreaMap): boolean {
    const baseItemId = areaMap.baseItemId
    return (apClient.items.received.find((item: Item) => item.id == baseItemId) !== undefined) // || areaMap.mapName == "An Official World"
}

export function handleGameFinishedMessage(message: RoundFinishedMessage) {
    let areaMap = mapsConfig.find((map) => map.mapId === message.mapId)
    if (areaMap === undefined || !isMapAvailable(areaMap)) {
        console.debug("Received a finished round on a map not available. Ignoring.")
        return
    }

    let locationsToCheck: number[] = []

    // Here we know the map is available to check locations
    if (message.roundScore == 5000) {
        console.log(`Player got a 5k on map ${message.mapName}`)
        console.debug("Checking location:", areaMap.baseLocationId + AreaLocations.FiveK)
        locationsToCheck.push(areaMap.baseLocationId + AreaLocations.FiveK)
    }

    if (message.totalScore >= medalThresholds[GACMedal.Bronze]) {
        locationsToCheck.push(areaMap.baseLocationId + AreaLocations.Bronze)
    }
    if (message.totalScore >= medalThresholds[GACMedal.Silver]) {
        locationsToCheck.push(areaMap.baseLocationId + AreaLocations.Silver)
    }
    if (message.totalScore >= medalThresholds[GACMedal.Gold]) {
        locationsToCheck.push(areaMap.baseLocationId + AreaLocations.Gold)
    }
    if (message.totalScore >= medalThresholds[GACMedal.Platinum]) {
        locationsToCheck.push(areaMap.baseLocationId + AreaLocations.Platinum)
    }

    locationsToCheck = locationsToCheck.filter((location) => !apClient.room.checkedLocations.includes(location))
    if (locationsToCheck.length > 0) {
        console.debug("Checking locations:", locationsToCheck)
        apClient.check(...locationsToCheck)
        void browser.runtime.sendMessage(new SendSoundEffectMessage(SoundEffectType.LocationChecked))
    }

    if (message.gameStatus == GeoguessrGameStatus.FINISHED) {
        console.log(`Player got ${message.totalScore} pts on map ${message.mapName}`)
    }

    updateGameState()
}

export function updateGameState() {
    console.debug("Items unlocked are:", apClient.items.received)
    console.debug("Locations available are:", apClient.room.missingLocations)
    console.debug("Locations checked are:", apClient.room.checkedLocations)

    for (let areaMap of mapsConfig) {
        updateAreaMap(areaMap)
    }

    console.debug("Game state after update is:", globalThis.gameState)
}

export function updateAreaMap(areaMap: AreaMap) {
    console.debug(`Updating game state of map ${areaMap.mapName}`)
    const baseLocationId = areaMap.baseLocationId
    const baseItemId = areaMap.baseItemId
    let mapStatus = globalThis.gameState.maps.find((map) => map.id === areaMap.mapId)

    if (mapStatus === undefined) {
        mapStatus = {
            available: true,
            gamemode: GACGamemode.None,
            bestMedal: GACMedal.None,
            bestScore: 0,
            bestSeed: "",
            fivekDone: false,
            id: areaMap.mapId,
            mapDone: false,
            name: areaMap.mapName
        }
        globalThis.gameState.maps.push(mapStatus)
    }

    mapStatus.bestMedal = GACMedal.None
    if (apClient.room.checkedLocations.includes(baseLocationId + AreaLocations.Bronze)) {
        mapStatus.bestMedal = GACMedal.Bronze
    }
    if (apClient.room.checkedLocations.includes(baseLocationId + AreaLocations.Silver)) {
        mapStatus.bestMedal = GACMedal.Silver
    }
    if (apClient.room.checkedLocations.includes(baseLocationId + AreaLocations.Gold)) {
        mapStatus.bestMedal = GACMedal.Gold
    }
    if (apClient.room.checkedLocations.includes(baseLocationId + AreaLocations.Platinum)) {
        mapStatus.bestMedal = GACMedal.Platinum
    }

    mapStatus.fivekDone = apClient.room.checkedLocations.includes(baseLocationId + AreaLocations.FiveK)

    mapStatus.available = (apClient.items.received.find((item: Item) => item.id == (baseItemId + AreaItems.Unlock)) !== undefined) // || mapStatus.name == "An Official World"

    mapStatus.gamemode = GACGamemode.None
    if (apClient.items.received.some((item: Item) => item.id == (baseItemId + AreaItems.Pan))) {
        mapStatus.gamemode |= GACGamemode.Pan
    }
    if (apClient.items.received.some((item: Item) => item.id == (baseItemId + AreaItems.Move))) {
        mapStatus.gamemode |= GACGamemode.Move
    }
    if (apClient.items.received.some((item: Item) => item.id == (baseItemId + AreaItems.Zoom))) {
        mapStatus.gamemode |= GACGamemode.Zoom
    }

    checkWinCondition()
}

function checkWinCondition() {
    if (globalThis.gameConfigData === undefined || globalThis.connectionStatus === undefined) {
        return;
    }

    const platAmount = globalThis.gameState.maps
        .filter(map => map.bestMedal === GACMedal.Platinum)
        .length;

    if(platAmount >= (globalThis.gameConfigData.plat_count as number))
    {
        apClient.goal()
        void browser.runtime.sendMessage(new SendSoundEffectMessage(SoundEffectType.GoalReached))
    }
}