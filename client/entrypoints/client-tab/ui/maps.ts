import { GACMedal } from "../../common/config/medals";
import { mapsConfig } from "../../common/config/maps";
import { GenerateGameMessage } from "../../common/messages";
import { GACGamemode, GACGameType, GACMap } from "../../common/models";
import { AreaLocations, PERFECT_SCORE } from "@/entrypoints/common/config/area-map";
import { WinCondition } from "@/entrypoints/common/config/win-condition";

const DEFAULT_COLOR = "rgb(36, 36, 36)"
const POSSIBLE_COLOR = "rgba(0, 255, 0, 0.2)"
const TRICKY_COLOR = "rgba(255, 255, 0, 0.2)"
const IMPOSSIBLE_COLOR = "rgba(255, 0, 0, 0.2)"
const DONE_COLOR = "rgba(0, 255, 255, 0.3)"

export function renderGameSection() {
    const manualSubmitSection = document.getElementById("manual-game-submit-section");
    manualSubmitSection!.style.display = globalThis.connectionStatus.authenticated ? "flex" : "none"
    renderGoalTracker()
    renderMapsTable()
}

function renderGoalTracker() {
    const goalStatus = document.getElementById('goal-tracker')!;
    if (globalThis.connectionStatus.authenticated) {
        goalStatus.style.display = "flex"
    } else {
        goalStatus.style.display = "none"
        return
    }

    const goalStatusContent = goalStatus.querySelector("#goal-tracker-content")!
    if (globalThis.gameState.configData.victory_condition as WinCondition == WinCondition.MedalCount) {
        const totalMedalCount = globalThis.gameState.maps.reduce<number>((acc, map, _index, _maps) => {
            return acc + (getBestMedal(map) as number)
        }, 0)
        goalStatusContent.innerHTML = `🥉🥈🥇🎯 - ${totalMedalCount}/${globalThis.gameState.configData.medal_count}`
        if (totalMedalCount >= (globalThis.gameState.configData.medal_count as number)) {
            goalStatusContent.innerHTML += ` - <strong>${browser.i18n.getMessage("goalStatusWin")}</strong>`
            goalStatus.style.backgroundColor = DONE_COLOR
        }
    } else {
        const totalPlatinumCount = globalThis.gameState.maps.filter((map) => getBestMedal(map) == GACMedal.Platinum).length
        goalStatusContent.innerHTML = `🎯 - ${totalPlatinumCount}/${globalThis.gameState.configData.plat_count}`
        if (totalPlatinumCount >= (globalThis.gameState.configData.plat_count as number)) {
            goalStatusContent.innerHTML += ` - <strong>${browser.i18n.getMessage("goalStatusWin")}</strong>`
            goalStatus.style.backgroundColor = DONE_COLOR
        }
    }


}

function renderMapsTable() {
    const mapTable = document.getElementById('map-table');
    mapTable!.style.display = globalThis.connectionStatus.authenticated ? "block" : "none"
    const recentLogs = document.getElementById('recent-logs');
    recentLogs!.style.display = globalThis.connectionStatus.authenticated ? "block" : "none"

    const tbody = mapTable?.querySelector('tbody');
    tbody!.innerHTML = ""
    for (const map of globalThis.gameState.maps) {
        const row = renderMapRow(map)
        if (row !== null) {
            tbody?.appendChild(row)
        }
    }
}

function renderMapRow(map: GACMap): HTMLTableRowElement | null {
    // If nothing has been unlocked for this map yet
    if (!map.visible) {
        return null
    }

    const row = document.createElement("tr");
    const mapNameCell: HTMLTableCellElement = document.createElement("td")
    const moveCell: HTMLTableCellElement = document.createElement("td")
    const panCell: HTMLTableCellElement = document.createElement("td")
    const zoomCell: HTMLTableCellElement = document.createElement("td")
    const progressionCell: HTMLTableCellElement = document.createElement("td")
    const locationsRemainingCell: HTMLTableCellElement = document.createElement("td")

    const currentGamemode: GACGamemode = map.gamemode;

    const currentAreaMap = mapsConfig.find((areaMap) => areaMap.mapId === map.id)
    const areaName = currentAreaMap?.areaName ?? map.name
    mapNameCell.textContent = areaName + ((map.unlocked && !map.playable) ? " (continent locked)" : "");
    mapNameCell.title = map.name;
    if (map.playable && !isMapFinished(map)) {
        mapNameCell.classList.add("activeLink")
        mapNameCell.onclick = (_: PointerEvent) => {
            const generateGameMessage = new GenerateGameMessage(map.id)
            void browser.runtime.sendMessage(generateGameMessage).then((response) => {
                if (!response.success) {
                    console.error("Error while generating game:", response.error)
                }
            })
        }
    } else if (!map.unlocked) {
        mapNameCell.classList.add("inactiveLink")
    }

    moveCell.textContent = currentGamemode & GACGamemode.Move ? "✔️" : "❌"
    moveCell.style.cursor = "default"
    panCell.textContent = currentGamemode & GACGamemode.Pan ? "✔️" : "❌"
    panCell.style.cursor = "default"
    zoomCell.textContent = currentGamemode & GACGamemode.Zoom ? "✔️" : "❌"
    zoomCell.style.cursor = "default"

    const gameTypeInLink = map.progression.gameType == GACGameType.Challenge ? "results" : "game"
    progressionCell.innerHTML = map.progression.bestSeed != "" ?
        `<a target="_blank" style="text-decoration: none;" href="https://geoguessr.com/${gameTypeInLink}/${map.progression.bestSeed}">${getProgressionText(map)}</a>` :
        `<span style="cursor: default">${getProgressionText(map)}</span>`

    locationsRemainingCell.innerHTML = getRemainingLocations(map)

    row.appendChild(mapNameCell)
    row.appendChild(moveCell)
    row.appendChild(panCell)
    row.appendChild(zoomCell)
    row.appendChild(progressionCell)
    row.appendChild(locationsRemainingCell)

    row.style.backgroundColor = getColorFromDifficulty(map)

    return row
}

function getRemainingLocations(map: GACMap): string {
    let result = ""
    for (const location of map.locationsMissing) {
        const newSpan = document.createElement("span")
        const areaLocationString = getAreaLocationString(location)
        newSpan.textContent = areaLocationString
        newSpan.title = getAreaLocationThreshold(map, location).toString()
        newSpan.style.cursor = "default"
        result += newSpan.outerHTML
    }
    return result
}

function getAreaLocationString(location: AreaLocations) {
    switch (location) {
        case AreaLocations.Bronze:
            return "🥉"
        case AreaLocations.Silver:
            return "🥈"
        case AreaLocations.Gold:
            return "🥇"
        case AreaLocations.Platinum:
            return "🎯"
        case AreaLocations.FiveK:
            return "[5k]"
    }
}

function getAreaLocationThreshold(map: GACMap, currentLocation: AreaLocations) {
    switch (currentLocation) {
        case AreaLocations.FiveK:
            return PERFECT_SCORE
        case AreaLocations.Bronze:
            return map.medalThresholds[GACMedal.Bronze]
        case AreaLocations.Silver:
            return map.medalThresholds[GACMedal.Silver]
        case AreaLocations.Gold:
            return map.medalThresholds[GACMedal.Gold]
        case AreaLocations.Platinum:
            return map.medalThresholds[GACMedal.Platinum]
    }
}

function getProgressionText(map: GACMap) {
    const score = map.progression.bestScore
    const scorePart = score > 0 ? `(${score})` : ""
    const fivekPart = map.progression.fivekDone ? ` [5k]` : ""
    const bestMedal = getBestMedal(map)
    return `${getMedalText(bestMedal)}${scorePart}${fivekPart}`
}

function getBestMedal(map: GACMap) {
    const score = map.progression.bestScore
    switch (true) {
        case score < map.medalThresholds[GACMedal.Bronze]:
            return GACMedal.None
        case score < map.medalThresholds[GACMedal.Silver]:
            return GACMedal.Bronze
        case score < map.medalThresholds[GACMedal.Gold]:
            return GACMedal.Silver
        case !globalThis.gameState.configData.include_platinums || score < map.medalThresholds[GACMedal.Platinum]:
            return GACMedal.Gold
        default:
            return GACMedal.Platinum
    }
}

function getMedalText(medal: GACMedal) {
    switch (medal) {
        case GACMedal.None:
            return "❌"
        case GACMedal.Bronze:
            return "🥉"
        case GACMedal.Silver:
            return "🥈"
        case GACMedal.Gold:
            return "🥇"
        case GACMedal.Platinum:
            return "🎯"
    }
}

function getColorFromDifficulty(map: GACMap): string {
    const hasMove = map.gamemode & GACGamemode.Move
    const hasPan = map.gamemode & GACGamemode.Pan
    const hasZoom = map.gamemode & GACGamemode.Zoom

    if (!map.playable) {
        return DEFAULT_COLOR
    }

    switch (true) {
        case map.progression.bestScore < map.medalThresholds[GACMedal.Bronze]:
            return POSSIBLE_COLOR
        case map.progression.bestScore < map.medalThresholds[GACMedal.Silver]:
            if (hasMove || hasPan) {
                return POSSIBLE_COLOR
            } else {
                return TRICKY_COLOR
            }
        case map.progression.bestScore < map.medalThresholds[GACMedal.Gold]:
            if (hasMove && hasPan) {
                return POSSIBLE_COLOR
            } else if (hasMove) {
                return TRICKY_COLOR
            } else {
                return IMPOSSIBLE_COLOR
            }
        case map.progression.bestScore < map.medalThresholds[GACMedal.Platinum]:
            if (hasMove && hasPan && hasZoom) {
                return POSSIBLE_COLOR
            } else if (hasMove && hasPan) {
                return map.progression.fivekDone ? TRICKY_COLOR : POSSIBLE_COLOR
            } else if (hasMove) {
                return map.progression.fivekDone ? IMPOSSIBLE_COLOR : TRICKY_COLOR
            } else {
                return IMPOSSIBLE_COLOR
            }
        default:
            return DONE_COLOR
    }
}

function isMapFinished(map: GACMap) {
    if (globalThis.gameState.configData.include_platinums) {
        return map.progression.bestScore >= map.medalThresholds[GACMedal.Platinum] && map.progression.fivekDone
    } else {
        return map.progression.bestScore >= map.medalThresholds[GACMedal.Gold] && map.progression.fivekDone
    }
}