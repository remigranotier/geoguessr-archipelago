import { clientStatuses, Item, type ClientStatus } from "archipelago.js"
import { apClient } from "."
import { DataConflictMessage, RoundFinishedMessage, SendSoundEffectMessage } from "../common/messages"
import { GACConnectionStatus, GACGamemode, GACGameState, GACMap, SoundEffectType } from "../common/models"
import { AreaItems, AreaLocations, AreaMap, LOCATIONS_PER_MAP, PERFECT_SCORE } from "../common/config/area-map"
import { mapsConfig } from "../common/config/maps"
import type { Continent, Country } from "../common/config/countries"
import { GACMedal } from "../common/config/medals"
import { WinCondition } from "../common/config/win-condition"
import { isPlatinumMedalEnabled } from "../common/utils"

export async function updateGameState(roundFinishedMessage?: RoundFinishedMessage, checkWinCon = false) {
    console.debug("Items unlocked are:", apClient.items.received)
    console.debug("Locations available are:", apClient.room.missingLocations)
    console.debug("Locations checked are:", apClient.room.checkedLocations)
    let gameState = await getGameState()

    if (roundFinishedMessage !== undefined) {
        updateMapProgression(roundFinishedMessage, gameState)
    }

    const baseLocationIds: number[] = getGameBaseLocationIds()
    for (let baseLocationId of baseLocationIds) {
        if (mapsConfig.get(baseLocationId) === undefined) {
            console.error("baseLocationId is", baseLocationId)
        }
        updateMapState(mapsConfig.get(baseLocationId)!, gameState)
    }

    if (checkWinCon) {
        checkWinCondition(gameState)
    }

    await setGameState(gameState)
}

function updateMapState(areaMap: AreaMap, gameState: GACGameState) {
    let mapStatus = gameState.maps.find((map) => map.areaMap.mapId === areaMap.mapId)!

    if (mapStatus === undefined) {
        mapStatus = new GACMap(areaMap)
        gameState.maps.push(mapStatus)
    }

    mapStatus.locationsMissing = getLocationsMissing(areaMap)
    mapStatus.medalThresholds = areaMap.medalThresholds

    const isUnlocked: boolean = isMapUnlocked(areaMap)
    mapStatus.unlocked = isUnlocked

    const mapGamemode: GACGamemode = getGamemode(areaMap)
    mapStatus.gamemode = mapGamemode

    const isSomethingUnlocked = isUnlocked || mapGamemode != GACGamemode.None

    mapStatus.visible = isMapVisible(areaMap, isSomethingUnlocked)

    mapStatus.playable = isMapPlayable(areaMap, isUnlocked)
}

function getGameBaseLocationIds() {
    const allLocationIds = apClient.room.allLocations
    const gameBaseLocationIds = new Set<number>()
    for (const locationId of allLocationIds) {
        if (locationId <= LOCATIONS_PER_MAP) { // For the World map, which is offset
            gameBaseLocationIds.add(1)
            continue
        }
        let baseLocationId = Math.floor(locationId / LOCATIONS_PER_MAP) * LOCATIONS_PER_MAP
        gameBaseLocationIds.add(baseLocationId)
    }

    return Array.from(gameBaseLocationIds)
}

function isContinentMapUnlocked(area: Country) {
    const continentNumber = area.continentNumber
    const continentAreaMap = mapsConfig.values().find((map: AreaMap) => map.area.kind == "continent" && map.area.continentNumber == continentNumber)!
    return isMapUnlocked(continentAreaMap)
}

function isSomeCountryMapVisible(area: Continent) {
    const continentNumber = area.continentNumber
    const childrenCountryMaps = mapsConfig.values().filter((map: AreaMap) => map.area.kind == "country" && map.area.continentNumber == continentNumber)!
    return childrenCountryMaps.some((countryMap: AreaMap) => isMapUnlocked(countryMap) || getGamemode(countryMap) != GACGamemode.None)
}

function isMapVisible(areaMap: AreaMap, isSomethingUnlocked?: boolean) {
    let result = isSomethingUnlocked ?? (isMapUnlocked(areaMap) || getGamemode(areaMap) != GACGamemode.None)
    if (areaMap.area.kind == "continent") {
        result ||= isSomeCountryMapVisible(areaMap.area)
    }
    return result
}

export function isMapPlayable(areaMap: AreaMap, isUnlocked?: boolean) {
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

function getLocationsMissing(areaMap: AreaMap): AreaLocations[] {
    const resultSet = new Set([
        AreaLocations.Bronze,
        AreaLocations.Silver,
        AreaLocations.Gold,
        AreaLocations.Platinum,
        AreaLocations.FiveK,
    ]);

    const removePlatinums = globalThis.gameConfigData ? !isPlatinumMedalEnabled(globalThis.gameConfigData) : false
    if (apClient.room.checkedLocations.includes(areaMap.baseLocationId + AreaLocations.Bronze)) {
        resultSet.delete(AreaLocations.Bronze)
    }
    if (apClient.room.checkedLocations.includes(areaMap.baseLocationId + AreaLocations.Silver)) {
        resultSet.delete(AreaLocations.Silver)
    }
    if (apClient.room.checkedLocations.includes(areaMap.baseLocationId + AreaLocations.Gold)) {
        resultSet.delete(AreaLocations.Gold)
    }
    if (apClient.room.checkedLocations.includes(areaMap.baseLocationId + AreaLocations.Platinum) || removePlatinums) {
        resultSet.delete(AreaLocations.Platinum)
    }
    if (apClient.room.checkedLocations.includes(areaMap.baseLocationId + AreaLocations.FiveK)) {
        resultSet.delete(AreaLocations.FiveK)
    }
    return Array.from(resultSet.values())
}

function checkWinCondition(gameState: GACGameState) {
    console.debug("Checking win condition")

    let hasWon = false

    switch (globalThis.gameConfigData.victory_condition as WinCondition) {
        case WinCondition.MedalCount:
            {
                const medalCount = gameState.maps.reduce(
                    (count, map) => count + getMedalAmount(map),
                    0
                );
                hasWon = medalCount >= (globalThis.gameConfigData.medal_count as number)
                console.debug("medal count : ", medalCount)
                break
            }

        case WinCondition.PlatinumCount:
            {
                const platAmount = gameState.maps
                    .filter(map => map.progression.bestScore >= map.medalThresholds[GACMedal.Platinum])
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

        gameState.gameFinished = true
    }
}

function getMedalAmount(map: GACMap) {
    return Object.entries(map.medalThresholds)
        .filter(([medal, threshold]) => medal != GACMedal.None.toString() && map.progression.bestScore >= threshold)
        .length
}

export function updateMapProgression(message: RoundFinishedMessage, gameState: GACGameState) {
    let map: GACMap = gameState.maps.find((m) => m.areaMap.mapId == message.mapId)!
    if (message.totalScore > map.progression.bestScore) {
        console.debug("Best score beaten:", message.totalScore, "vs", map.progression.bestScore, "before")
        map.progression.bestScore = message.totalScore
        map.progression.bestSeed = message.gameId
        map.progression.gameType = message.gameType
    }

    if (message.roundScore == PERFECT_SCORE && !map.progression.fivekDone) {
        console.debug("New 5k done")
        map.progression.fivekDone = true
    }
}

export async function getGameState(): Promise<GACGameState> {
    const maybeGameState = await storage.getItem<GACGameState>(`local:${apClient.room.seedName}-${apClient.name}`)
    if (maybeGameState === null) {
        console.debug(`No game state in storage for key local:${apClient.room.seedName}-${apClient.name}. initializing`)
        return new GACGameState()
    }
    return maybeGameState
}

export async function setGameState(gameState: GACGameState) {
    await storage.setItem(`local:${apClient.room.seedName}-${apClient.name}`, gameState)
}

export async function handleDataConflict(message: DataConflictMessage) {
    let gameState = await getGameState()

    let serverConnection = new GACConnectionStatus()

    console.debug("Replacing URL with new server")
    if (message.clearPreviousData) {
        console.debug("Resetting maps content")
        gameState = new GACGameState()
    } else {
        gameState.url = serverConnection.server
    }

    await setGameState(gameState)
    void updateGameState()
}