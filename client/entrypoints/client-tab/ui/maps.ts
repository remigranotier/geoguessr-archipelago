import { GACMedal } from "../../common/config/medals";
import { mapsConfig } from "../../common/config/maps";
import { GenerateGameMessage } from "../../common/messages";
import { GACGamemode, GACGameType, GACMap } from "../../common/models";
import { AreaLocations } from "@/entrypoints/common/config/area-map";

const DEFAULT_COLOR = "rgb(36, 36, 36)"
const POSSIBLE_COLOR = "rgba(0, 255, 0, 0.2)"
const TRICKY_COLOR = "rgba(255, 255, 0, 0.2)"
const IMPOSSIBLE_COLOR = "rgba(255, 0, 0, 0.2)"
const DONE_COLOR = "rgba(0, 255, 255, 0.3)"

export function renderGameSection() {
    const manualSubmitSection = document.getElementById("manual-game-submit-section");
    manualSubmitSection!.style.display = globalThis.connectionStatus.authenticated ? "flex" : "none"
    renderMapsTable()
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
    const achievementsCell: HTMLTableCellElement = document.createElement("td")
    const locationsRemainingCell: HTMLTableCellElement = document.createElement("td")

    const currentGamemode: GACGamemode = map.gamemode;

    const currentAreaMap = mapsConfig.find((areaMap) => areaMap.mapId === map.id)
    const areaName = currentAreaMap?.areaName ?? map.name
    mapNameCell.textContent = areaName + ((map.unlocked && !map.playable) ? " (continent locked)" : "");
    mapNameCell.title = map.name;
    if (map.playable && map.progression.bestScore < map.medalThresholds[GACMedal.Platinum]) {
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
    panCell.textContent = currentGamemode & GACGamemode.Pan ? "✔️" : "❌"
    zoomCell.textContent = currentGamemode & GACGamemode.Zoom ? "✔️" : "❌"

    const gameTypeInLink = map.progression.gameType == GACGameType.Challenge ? "results" : "game"
    achievementsCell.innerHTML = map.progression.bestSeed != "" ?
        `<a target="_blank" style="text-decoration: none;" href="https://geoguessr.com/${gameTypeInLink}/${map.progression.bestSeed}">${getAchievementsText(map)}</a>` :
        getAchievementsText(map)

    locationsRemainingCell.innerHTML = getRemainingLocations(map)

    row.appendChild(mapNameCell)
    row.appendChild(moveCell)
    row.appendChild(panCell)
    row.appendChild(zoomCell)
    row.appendChild(achievementsCell)
    row.appendChild(locationsRemainingCell)

    row.style.backgroundColor = getColorFromDifficulty(map)

    return row
}

function getRemainingLocations(map: GACMap): string {
    let result = ""
    for (const location of map.locationsMissing) {
        result += getAreaLocationString(location)
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

function getAchievementsText(map: GACMap) {
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
        case score < map.medalThresholds[GACMedal.Platinum]:
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