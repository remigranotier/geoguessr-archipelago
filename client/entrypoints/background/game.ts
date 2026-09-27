import type { Client } from 'archipelago.js'
import { GACGamemode, GACMap, GACMedal, GenerateGameMessage, GeoguessrGameStatus, RoundFinishedMessage } from '../common/models.ts'
import { AreaItems, AreaLocations, AreaMap, mapsConfig, medalThresholds } from '../common/config.ts'
import { client } from './index.ts'

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

    const responseJson = await response.json()
    const gameId = responseJson["token"]
    return gameId
}

export async function handleGenerateGameMessage(message: GenerateGameMessage) {
    const map = globalThis.gameState.maps.find((m: GACMap) => m.id === message.mapId)
    if (map === undefined) {
        throw new Error(`No map with id ${message.mapId} found`)
    }

    const gameId = await generateGame(map.id, map.gamemode)
    const newTab = await browser.tabs.create({
        url: `https://www.geoguessr.com/game/${gameId}`
    })
}

export function isMapAvailable(areaMap: AreaMap): boolean {
    const baseItemId = areaMap.baseItemId
    return baseItemId + 1 in client.items.received || areaMap.mapName == "An Official World"
}

export async function handleGameFinishedMessage(message: RoundFinishedMessage) {
    let areaMap = mapsConfig.find((map) => map.mapId === message.mapId)
    if (areaMap === undefined || !isMapAvailable(areaMap)) {
        console.debug("Received a finished round on a map not available. Ignoring.")
        return
    }

    // Here we know the map is available to check locations
    if (message.roundScore == 5000) {
        console.log(`Player got a 5k on map ${message.mapName}`)
        console.debug("Checking location:", areaMap.baseLocationId + AreaLocations.FiveK)
        // client.check(areaMap.baseLocationId + AreaLocations.FiveK)
    }

    if (message.gameStatus == GeoguessrGameStatus.FINISHED) {
        console.log(`Player got ${message.totalScore} pts on map ${message.mapName}`)
        const locationsToCheck: number[] = []
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
        console.debug("Checking locations:", locationsToCheck)
        // client.check(...locationsToCheck)
    }
}

export function getCurrentGameState() {
    return globalThis.gameState
}

export function updateGameState(client: Client) {
    console.debug("Items unlocked are:", client.items.received)
    console.debug("Locations available are:", client.room.missingLocations)
    console.debug("Locations checked are:", client.room.checkedLocations)

    for (var areaMap of mapsConfig) {
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
        if (baseLocationId + AreaLocations.Bronze in client.room.checkedLocations) {
            mapStatus.bestMedal = GACMedal.Bronze
        }
        if (baseLocationId + AreaLocations.Silver in client.room.checkedLocations) {
            mapStatus.bestMedal = GACMedal.Silver
        }
        if (baseLocationId + AreaLocations.Gold in client.room.checkedLocations) {
            mapStatus.bestMedal = GACMedal.Gold
        }
        if (baseLocationId + AreaLocations.Platinum in client.room.checkedLocations) {
            mapStatus.bestMedal = GACMedal.Platinum
        }

        mapStatus.fivekDone = baseLocationId + AreaLocations.FiveK in client.room.checkedLocations

        mapStatus.mapDone = baseLocationId + AreaLocations.MapComplete in client.room.checkedLocations

        mapStatus.available = baseItemId + AreaItems.Unlock in client.items.received || mapStatus.name == "An Official World" // TODO: make An Official World an item in world

        mapStatus.gamemode = GACGamemode.None
        if (baseItemId + AreaItems.Pan in client.items.received) {
            mapStatus.gamemode |= GACGamemode.Pan
        }
        if (baseItemId + AreaItems.Move in client.items.received) {
            mapStatus.gamemode |= GACGamemode.Move
        }
        if (baseItemId + AreaItems.Zoom in client.items.received) {
            mapStatus.gamemode |= GACGamemode.Zoom
        }

    }

    console.debug("Game state after update is:", globalThis.gameState)
}