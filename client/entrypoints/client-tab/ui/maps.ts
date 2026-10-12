import { mapsConfig } from "../../common/config";
import { GenerateGameMessage } from "../../common/messages";
import { GACGamemode, GACGameType, GACMap, GACMedal } from "../../common/models";

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

export function renderMapsTable() {
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

export function renderMapRow(map: GACMap): HTMLTableRowElement | null {
    // If nothing has been unlocked for this map yet
    if (!map.available && map.gamemode == GACGamemode.None) {
        return null
    }

    const row = document.createElement("tr");
    const mapNameCell: HTMLTableCellElement = document.createElement("td")
    const moveCell: HTMLTableCellElement = document.createElement("td")
    const panCell: HTMLTableCellElement = document.createElement("td")
    const zoomCell: HTMLTableCellElement = document.createElement("td")
    const bestMedalCell: HTMLTableCellElement = document.createElement("td")
    const fivekCell: HTMLTableCellElement = document.createElement("td")

    const currentGamemode: GACGamemode = map.gamemode;

    const currentAreaMap = mapsConfig.find((areaMap) => areaMap.mapId === map.id)
    const areaName = currentAreaMap?.areaName ?? map.name
    mapNameCell.textContent = areaName;
    mapNameCell.title = map.name;
    if (map.available && map.bestMedal != GACMedal.Platinum) {
        mapNameCell.classList.add("activeLink")
        mapNameCell.onclick = (_: PointerEvent) => {
            const generateGameMessage = new GenerateGameMessage(map.id)
            void browser.runtime.sendMessage(generateGameMessage).then((response) => {
                if (!response.success) {
                    console.error("Error while generating game:", response.error)
                }
            })
        }
    } else {
        mapNameCell.classList.add("inactiveLink")
    }

    moveCell.textContent = currentGamemode & GACGamemode.Move ? "✔️" : "❌"
    panCell.textContent = currentGamemode & GACGamemode.Pan ? "✔️" : "❌"
    zoomCell.textContent = currentGamemode & GACGamemode.Zoom ? "✔️" : "❌"

    const gameTypeInLink = map.gameType == GACGameType.Challenge ? "results" : "game"
    bestMedalCell.innerHTML = map.bestSeed != "" ?
        `<a target="_blank" style="text-decoration: none;" href="https://geoguessr.com/${gameTypeInLink}/${map.bestSeed}">${getMedalText(map.bestMedal)}</a>` :
        getMedalText(map.bestMedal)

    fivekCell.textContent = map.fivekDone ? "✔️" : "❌"

    row.appendChild(mapNameCell)
    row.appendChild(moveCell)
    row.appendChild(panCell)
    row.appendChild(zoomCell)
    row.appendChild(bestMedalCell)
    row.appendChild(fivekCell)

    row.style.backgroundColor = getColorFromDifficulty(map)

    return row
}

function getMedalText(medal: GACMedal) {
    switch (medal) {
        case GACMedal.Bronze:
            return "🥉"
        case GACMedal.Silver:
            return "🥈"
        case GACMedal.Gold:
            return "🥇"
        case GACMedal.Platinum:
            return "🎯"
        case GACMedal.None:
            return "❌"
    }
}

function getColorFromDifficulty(map: GACMap): string {
    const hasMoveOrPan = map.gamemode & (GACGamemode.Move | GACGamemode.Pan)
    const hasMove = map.gamemode & GACGamemode.Move
    const hasPan = map.gamemode & GACGamemode.Pan
    const hasZoom = map.gamemode & GACGamemode.Zoom

    if (!map.available) {
        return DEFAULT_COLOR
    }

    switch (map.bestMedal) {
        case GACMedal.None:
            return POSSIBLE_COLOR
        case GACMedal.Bronze:
            if (hasMoveOrPan) {
                return POSSIBLE_COLOR
            } else {
                return TRICKY_COLOR
            }
        case GACMedal.Silver:
            if (hasMove && hasPan) {
                return POSSIBLE_COLOR
            } else if (map.gamemode & GACGamemode.Move) {
                return TRICKY_COLOR
            } else {
                return IMPOSSIBLE_COLOR
            }
        case GACMedal.Gold:
            if (hasMove && hasPan && hasZoom) {
                return POSSIBLE_COLOR
            } else if (hasMove && hasPan) {
                return map.fivekDone ? TRICKY_COLOR : POSSIBLE_COLOR
            } else if (hasMove) {
                return map.fivekDone ? IMPOSSIBLE_COLOR : TRICKY_COLOR
            } else {
                return IMPOSSIBLE_COLOR
            }
        case GACMedal.Platinum:
            return DONE_COLOR
    }
}