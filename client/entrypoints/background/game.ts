import { clientStatuses, type ClientStatus, type Item } from 'archipelago.js'
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
} from '../common/config/area-map.ts'

import { apClient } from './index.ts'
import { SendSoundEffectMessage, type GenerateGameMessage, type RoundFinishedMessage } from '../common/messages.ts'
import { mapsConfig } from '../common/config/maps.ts'
import { medalThresholds } from '../common/config/medals.ts'
import type { Continent, Country } from '../common/config/countries.ts'

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

function isMapAvailable(areaMap: AreaMap): boolean {
    const baseItemId = areaMap.baseItemId
    return (apClient.items.received.some((item: Item) => item.id == baseItemId))
}

function hasForbiddenGamemode(areaMap: AreaMap, message: RoundFinishedMessage) {
    if (message.gamemode & GACGamemode.Pan) {
        if (!apClient.items.received.some((item: Item) => item.id == areaMap.baseItemId + AreaItems.Pan)) {
            return true;
        }
    }
    if (message.gamemode & GACGamemode.Move) {
        if (!apClient.items.received.some((item: Item) => item.id == areaMap.baseItemId + AreaItems.Move)) {
            return true;
        }
    }
    if (message.gamemode & GACGamemode.Zoom) {
        if (!apClient.items.received.some((item: Item) => item.id == areaMap.baseItemId + AreaItems.Zoom)) {
            return true;
        }
    }
    return false;
}

export function handleRoundFinishedMessage(message: RoundFinishedMessage) {
    let areaMap = mapsConfig.find((map) => map.mapId === message.mapId)
    if (areaMap === undefined || !isMapAvailable(areaMap)) {
        throw new Error("Map not available")
    }

    if (hasForbiddenGamemode(areaMap, message)) {
        throw new Error("Forbidden gamemode in received game")
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

    let map: GACMap | undefined = globalThis.gameState.maps.find((m) => m.id == message.mapId)
    if (map !== undefined && message.totalScore > map.bestScore) {
        console.debug("Best score beaten:", message.totalScore, "vs", map.bestScore, "before")
        map.bestScore = message.totalScore
        map.bestSeed = message.gameId
        map.gameType = message.gameType
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

    if (globalThis.gameConfigData !== undefined && apClient.authenticated) {
        checkWinCondition()
    }
}

function updateAreaMap(areaMap: AreaMap) {
    console.debug(`Updating game state of map ${areaMap.mapName}`)
    let mapStatus = globalThis.gameState.maps.find((map) => map.id === areaMap.mapId)

    if (mapStatus === undefined) {
        mapStatus = new GACMap(areaMap.mapId, areaMap.mapName)
        globalThis.gameState.maps.push(mapStatus)
    }

    const bestMedal = getBestMedal(areaMap)
    mapStatus.bestMedal = bestMedal

    mapStatus.fivekDone = apClient.room.checkedLocations.includes(areaMap.baseLocationId + AreaLocations.FiveK)

    const isUnlocked: boolean = isMapUnlocked(areaMap)
    mapStatus.unlocked = isUnlocked

    const mapGamemode: GACGamemode = getGamemode(areaMap)
    mapStatus.gamemode = mapGamemode

    const isSomethingUnlocked = isUnlocked || mapGamemode != GACGamemode.None

    mapStatus.visible = isMapVisible(areaMap, isSomethingUnlocked)

    mapStatus.playable = isMapPlayable(areaMap, isUnlocked, bestMedal)
}

function isContinentMapUnlocked(area: Country) {
    const continentNumber = area.continentNumber
    const continentAreaMap = mapsConfig.find((map: AreaMap) => map.area.kind == "continent" && map.area.continentNumber == continentNumber)!
    return isMapUnlocked(continentAreaMap)
}

function isSomeCountryMapVisible(area: Continent) {
    const continentNumber = area.continentNumber
    const childrenCountryMaps = mapsConfig.filter((map: AreaMap) => map.area.kind == "country" && map.area.continentNumber == continentNumber)!
    return childrenCountryMaps.some((countryMap: AreaMap) => isMapUnlocked(countryMap) || getGamemode(countryMap) != GACGamemode.None)
}

function isMapVisible(areaMap: AreaMap, isSomethingUnlocked?: boolean) {
    let result = isSomethingUnlocked ?? (isMapUnlocked(areaMap) || getGamemode(areaMap) != GACGamemode.None)
    if (areaMap.area.kind == "continent") {
        result ||= isSomeCountryMapVisible(areaMap.area)
    }
    return result
}

function isMapPlayable(areaMap: AreaMap, isUnlocked?: boolean, bestMedal?: GACMedal) {
    let result = (isUnlocked ?? isMapUnlocked(areaMap))
    if (areaMap.area.kind == "country") {
        result &&= isContinentMapUnlocked(areaMap.area)
    }
    return result
}

function isMapUnlocked(areaMap: AreaMap) {
    return apClient.items.received.some((item: Item) => item.id == (areaMap.baseItemId + AreaItems.Unlock))
}

function getGamemode(areaMap: AreaMap) {
    let result = GACGamemode.None
    if (apClient.items.received.some((item: Item) => item.id == (areaMap.baseItemId + AreaItems.Pan))) {
        result |= GACGamemode.Pan
    }
    if (apClient.items.received.some((item: Item) => item.id == (areaMap.baseItemId + AreaItems.Move))) {
        result |= GACGamemode.Move
    }
    if (apClient.items.received.some((item: Item) => item.id == (areaMap.baseItemId + AreaItems.Zoom))) {
        result |= GACGamemode.Zoom
    }
    return result
}

function getBestMedal(areaMap: AreaMap) {
    let result = GACMedal.None
    if (apClient.room.checkedLocations.includes(areaMap.baseLocationId + AreaLocations.Bronze)) {
        result = GACMedal.Bronze
    }
    if (apClient.room.checkedLocations.includes(areaMap.baseLocationId + AreaLocations.Silver)) {
        result = GACMedal.Silver
    }
    if (apClient.room.checkedLocations.includes(areaMap.baseLocationId + AreaLocations.Gold)) {
        result = GACMedal.Gold
    }
    if (apClient.room.checkedLocations.includes(areaMap.baseLocationId + AreaLocations.Platinum)) {
        result = GACMedal.Platinum
    }
    return result
}

function checkWinCondition() {
    console.debug("Checking win condition")

    let hasWon = false

    switch (globalThis.gameConfigData.victory_condition) {
        case 0: //medal count
            {
                const medalCount = globalThis.gameState.maps.reduce(
                    (count, map) => count + map.bestMedal,
                    0
                );
                hasWon = medalCount >= (globalThis.gameConfigData.medal_count as number)
                console.debug("medal count : ", medalCount)
                break
            }

        case 1: //platinum count
            {
                const platAmount = globalThis.gameState.maps
                    .filter(map => map.bestMedal === GACMedal.Platinum)
                    .length;
                hasWon = platAmount >= (globalThis.gameConfigData.plat_count as number)
                console.debug("plat amount : ", platAmount)
                break
            }

        default:
            console.warn("Unknown victory condition:", globalThis.gameConfigData.victory_condition)
    }

    if (hasWon) {
        apClient.players.self.fetchStatus().then((status: ClientStatus) => {
            if (status != clientStatuses.goal) {
                apClient.goal()
                void browser.runtime.sendMessage(new SendSoundEffectMessage(SoundEffectType.GoalReached))
            } else {
                console.debug("goal() action triggered after status already being goal, ignoring.")
            }
        }).catch((error) => {
            console.error("Error while fetching player status:", error)
            apClient.goal()
        })
    }
}