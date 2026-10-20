import {
    GACGamemode,
    GACMap,
    SoundEffectType,
} from '../common/models.ts'

import {
    AreaItems,
    AreaLocations,
    AreaMap,
    NUMBER_OF_ROUNDS,
    PERFECT_SCORE,
} from '../common/config/area-map.ts'

import { apClient } from './index.ts'
import { SendSoundEffectMessage, type GenerateGameMessage, type RoundFinishedMessage } from '../common/messages.ts'
import { mapsConfig } from '../common/config/maps.ts'
import { getGameState, isMapPlayable, updateGameState } from './state.ts'
import type { Item } from 'archipelago.js'
import { GACMedal } from '../common/config/medals.ts'

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
    const gameState = await getGameState()
    const map = gameState.maps.find((m: GACMap) => m.areaMap.mapId === message.mapId)
    if (map === undefined) {
        throw new Error(`No map with id ${message.mapId} found`)
    }

    const gameId = await generateGame(map.areaMap.mapId, map.gamemode)
    const _newTab = await browser.tabs.create({
        url: `https://www.geoguessr.com/game/${gameId}`
    })
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

function checkRoundFinishedMessage(message: RoundFinishedMessage, areaMap: AreaMap) {
    if (!isMapPlayable(areaMap)) {
        throw new Error("Map not yet available for play")
    }

    if (hasForbiddenGamemode(areaMap, message)) {
        throw new Error("Forbidden gamemode in received game")
    }

    if (message.roundCount != NUMBER_OF_ROUNDS) {
        throw new Error(`Game does not have ${NUMBER_OF_ROUNDS} rounds exactly`)
    }
}

export function handleRoundFinishedMessage(message: RoundFinishedMessage) {
    let areaMap = mapsConfig.values().find((map) => map.mapId === message.mapId)
    if (areaMap === undefined) {
        throw new Error("Map does not exist in Geoguessr Archipelago")
    }
    checkRoundFinishedMessage(message, areaMap)

    let locationsToCheck: number[] = []

    // Here we know the map is available to check locations
    if (message.roundScore == PERFECT_SCORE) {
        console.log(`Player got a 5k on map ${message.mapName}`)
        console.debug("Checking location:", areaMap.baseLocationId + AreaLocations.FiveK)
        locationsToCheck.push(areaMap.baseLocationId + AreaLocations.FiveK)
    }

    if (message.totalScore >= areaMap.medalThresholds[GACMedal.Bronze]) {
        locationsToCheck.push(areaMap.baseLocationId + AreaLocations.Bronze)
    }
    if (message.totalScore >= areaMap.medalThresholds[GACMedal.Silver]) {
        locationsToCheck.push(areaMap.baseLocationId + AreaLocations.Silver)
    }
    if (message.totalScore >= areaMap.medalThresholds[GACMedal.Gold]) {
        locationsToCheck.push(areaMap.baseLocationId + AreaLocations.Gold)
    }
    if (message.totalScore >= areaMap.medalThresholds[GACMedal.Platinum] && globalThis.gameConfigData.include_platinums) {
        locationsToCheck.push(areaMap.baseLocationId + AreaLocations.Platinum)
    }

    locationsToCheck = locationsToCheck.filter((location) => !apClient.room.checkedLocations.includes(location))
    if (locationsToCheck.length > 0) {
        console.debug("Checking locations:", locationsToCheck)
        apClient.check(...locationsToCheck)
        void browser.runtime.sendMessage(new SendSoundEffectMessage(SoundEffectType.LocationChecked))
    }

    void updateGameState(message, true)
}