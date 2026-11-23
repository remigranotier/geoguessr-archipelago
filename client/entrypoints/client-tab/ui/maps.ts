import { GACMedal, getAreaLocationIcon, getMedalIcon } from "../../common/config/medals";
import { mapsConfig } from "../../common/config/maps";
import { GenerateGameMessage } from "../../common/messages";
import { GACGamemode, GACGameType, GACMap, type GACResponse } from "../../common/models";
import { AreaLocations, PERFECT_SCORE } from "@/entrypoints/common/config/area-map";
import { WinCondition } from "@/entrypoints/common/config/win-condition";
import { renderDebugOptions } from "./debug";
import { renderHintTable } from "./hints-display";

const DEFAULT_COLOR = "rgb(0, 0, 0, 0)"
const POSSIBLE_COLOR = "rgba(0, 255, 0, 0.3)"
const TRICKY_COLOR = "rgba(255, 255, 0, 0.3)"
const IMPOSSIBLE_COLOR = "rgba(255, 0, 0, 0.3)"
const DONE_COLOR = "rgba(0, 255, 255, 0.3)"

export function renderGameSection() {
    const manualSubmitSection = document.getElementById("manual-game-submit-section");
    manualSubmitSection!.style.display = globalThis.connectionStatus.authenticated ? "flex" : "none"
    renderGoalTracker()
    renderMapsTable()
    renderHintTable()
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
        const bronzeIcon = getAreaLocationIcon(AreaLocations.Bronze)
        const silverIcon = getAreaLocationIcon(AreaLocations.Silver)
        const goldIcon = getAreaLocationIcon(AreaLocations.Gold)
        const platinumIcon = getAreaLocationIcon(AreaLocations.Platinum)
        const medalIcons = document.createElement("span")
        medalIcons.style.display = "flex"
        medalIcons.style.alignItems = "center"
        medalIcons.appendChild(bronzeIcon)
        medalIcons.appendChild(silverIcon)
        medalIcons.appendChild(goldIcon)
        medalIcons.appendChild(platinumIcon)
        goalStatusContent.innerHTML = `${medalIcons.outerHTML} - ${totalMedalCount}/${globalThis.gameState.configData.medal_count}`
        goalStatus.style.backgroundColor = "rgba(0, 0, 0, 0.5)"
        if (totalMedalCount >= (globalThis.gameState.configData.medal_count as number)) {
            goalStatusContent.innerHTML += ` - <strong>${browser.i18n.getMessage("goalStatusWin")}</strong>`
            goalStatus.style.backgroundColor = DONE_COLOR
        }
    } else {
        const totalPlatinumCount = globalThis.gameState.maps.filter((map) => getBestMedal(map) == GACMedal.Platinum).length
        goalStatusContent.innerHTML = `${getAreaLocationIcon(AreaLocations.Platinum).outerHTML} - ${totalPlatinumCount}/${globalThis.gameState.configData.plat_count}`
        goalStatus.style.backgroundColor = "rgba(0, 0, 0, 0.5)"
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
            if (map.areaMap.area.kind == "continent") {
                const breakLine = document.createElement("tr")
                const breakLineContent = document.createElement("th")
                breakLineContent.colSpan = 6
                const breakLineDiv = document.createElement("div")
                breakLineDiv.style.display = "flex"
                breakLineDiv.style.gap = "1em"
                breakLineDiv.style.alignItems = "center"
                breakLineDiv.appendChild(document.createElement("hr"))
                const zoneName = document.createElement("div")
                zoneName.textContent = browser.i18n.getMessage(map.areaMap.areaNameKey as "@@extension_id")
                zoneName.style.whiteSpace = "nowrap"
                breakLineDiv.appendChild(zoneName)
                breakLineDiv.appendChild(document.createElement("hr"))
                breakLineContent.appendChild(breakLineDiv)
                breakLine.appendChild(breakLineContent)
                tbody?.appendChild(breakLine)
            }
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

    const currentAreaMap = mapsConfig.values().find((areaMap) => areaMap.mapId === map.areaMap.mapId)
    const areaNameKey = currentAreaMap?.areaNameKey ?? map.areaMap.areaNameKey
    mapNameCell.textContent = browser.i18n.getMessage(areaNameKey as "@@extension_id") + ((map.unlocked && !map.playable) ? ` (${browser.i18n.getMessage("continentLocked")})` : "");
    mapNameCell.title = map.areaMap.mapName;
    if (map.playable && !isMapFinished(map)) {
        mapNameCell.classList.add("activeLink")
        mapNameCell.onclick = async (_: PointerEvent) => {
            const generateGameMessage = new GenerateGameMessage(map.areaMap.mapId)
            const generateGameResponse: GACResponse = await browser.runtime.sendMessage(generateGameMessage)
            if (!generateGameResponse.success) {
                console.error("Error while generating game:", generateGameResponse.error)
                return
            }
            const gameId: string = generateGameResponse.data
            const _newTab = await browser.tabs.create({
                url: `https://www.geoguessr.com/game/${gameId}`
            })
        }
    } else if (!map.unlocked) {
        mapNameCell.classList.add("inactiveLink")
    }

    moveCell.textContent = currentGamemode & GACGamemode.Move ? "✅" : "❌"
    moveCell.style.cursor = "default"
    panCell.textContent = currentGamemode & GACGamemode.Pan ? "✅" : "❌"
    panCell.style.cursor = "default"
    zoomCell.textContent = currentGamemode & GACGamemode.Zoom ? "✅" : "❌"
    zoomCell.style.cursor = "default"

    addProgressionInfo(progressionCell, map)

    locationsRemainingCell.appendChild(getRemainingLocationsCell(map))

    row.appendChild(mapNameCell)
    row.appendChild(moveCell)
    row.appendChild(panCell)
    row.appendChild(zoomCell)
    row.appendChild(progressionCell)
    row.appendChild(locationsRemainingCell)

    if (import.meta.env.MODE == "development") {
        const debugCell = renderDebugOptions(map)
        row.appendChild(debugCell)
    }

    row.style.backgroundColor = getColorFromDifficulty(map)

    return row
}

function addProgressionInfo(progressionCell: HTMLElement, map: GACMap) {
    const gameTypeInLink = map.progression.gameType == GACGameType.Challenge ? "results" : "game"
    const progressionContentDiv = document.createElement("div")
    progressionContentDiv.className = "map-progression-with-seed"
    progressionContentDiv.style.gap = "3px"

    if (map.progression.bestSeed != "") {
        const linkElement = document.createElement("a")
        linkElement.target = "_blank"
        linkElement.style.textDecoration = "none"
        linkElement.href = `https://geoguessr.com/${gameTypeInLink}/${map.progression.bestSeed}`
        const progressionDiv = getProgressionDiv(map)
        progressionDiv.className = "map-progression-with-seed"
        linkElement.appendChild(progressionDiv)
        progressionContentDiv.appendChild(linkElement)
    } else {
        const noLinkElement = document.createElement("span")
        noLinkElement.className = "map-progression-without-seed"
        noLinkElement.appendChild(getProgressionDiv(map))
        progressionContentDiv.appendChild(noLinkElement)
    }


    if (map.progression.fivekDone) {
        const fivekDiv = document.createElement("div")
        fivekDiv.appendChild(getAreaLocationIcon(AreaLocations.FiveK))
        progressionContentDiv.appendChild(fivekDiv)
    }

    progressionCell.appendChild(progressionContentDiv)
}

function getRemainingLocationsCell(map: GACMap) {
    let remainingLocationsCell = document.createElement("div")
    remainingLocationsCell.className = "locations-remaining-cell"
    const locationsNotObtained = getLocationsNotObtained(map)
    for (const location of locationsNotObtained) {
        const areaLocationIcon = getAreaLocationIcon(location)
        areaLocationIcon.title = getAreaLocationThreshold(map, location).toString()
        areaLocationIcon.style.cursor = "help"
        if (!map.locationsMissing.includes(location)) {
            areaLocationIcon.style.filter = "grayscale(100%)"
            areaLocationIcon.style.opacity = "50%"
        }
        remainingLocationsCell.appendChild(areaLocationIcon)
    }
    return remainingLocationsCell
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

function getProgressionDiv(map: GACMap) {
    const progressionDiv = document.createElement("div")
    const scoreSpan = document.createElement("span")
    const score = map.progression.bestScore
    scoreSpan.textContent = score > 0 ? `(${score})` : ""
    const bestMedal = getBestMedal(map)
    const medalIcon = getMedalIcon(bestMedal)
    progressionDiv.appendChild(medalIcon)
    progressionDiv.appendChild(scoreSpan)

    return progressionDiv
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
function getLocationsNotObtained(map: GACMap) {
    const locationsNotObtained = []
    const score = map.progression.bestScore
    if (score < map.medalThresholds[GACMedal.Bronze]) {
        locationsNotObtained.push(AreaLocations.Bronze)
    }
    if (score < map.medalThresholds[GACMedal.Silver]) {
        locationsNotObtained.push(AreaLocations.Silver)
    }
    if (score < map.medalThresholds[GACMedal.Gold]) {
        locationsNotObtained.push(AreaLocations.Gold)
    }
    if (globalThis.gameState.configData.include_platinums && score < map.medalThresholds[GACMedal.Platinum]) {
        locationsNotObtained.push(AreaLocations.Platinum)
    }
    if (!map.progression.fivekDone) {
        locationsNotObtained.push(AreaLocations.FiveK)
    }

    return locationsNotObtained
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
            if (hasMove || hasPan || map.areaMap.area.kind != "country") {
                return POSSIBLE_COLOR
            } else {
                return TRICKY_COLOR
            }
        case map.progression.bestScore < map.medalThresholds[GACMedal.Gold] || !map.progression.fivekDone:
            if (hasMove && hasPan) {
                return POSSIBLE_COLOR
            } else if (hasMove) {
                return TRICKY_COLOR
            } else {
                return IMPOSSIBLE_COLOR
            }
        case (map.progression.bestScore < map.medalThresholds[GACMedal.Platinum]) && globalThis.gameState.configData.include_platinums == 1:
            if (hasMove && hasPan && hasZoom) {
                return POSSIBLE_COLOR
            } else if (hasMove && hasPan) {
                return TRICKY_COLOR
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