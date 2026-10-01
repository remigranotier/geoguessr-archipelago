import { mapsConfig } from "../../common/config";
import { GenerateGameMessage } from "../../common/messages";
import { GACGamemode, GACMap, GACMedal } from "../../common/models";

const DEFAULT_COLOR = "rgb(36, 36, 36)"
const LOGIC_COLOR = "rgba(0, 255, 0, 0.2)"
const OUT_OF_LOGIC_COLOR = "rgba(255, 255, 0, 0.2)"
const UNLIKELY_COLOR = "rgba(255, 128, 0, 0.2)"
const IMPOSSIBLE_COLOR = "rgba(255, 0, 0, 0.2)"
const DONE_COLOR = "rgba(0, 255, 255, 0.3)"

export function renderMaps() {
    const mapTable = document.getElementById('map-table');
    mapTable!.style.display = globalThis.connectionStatus.authenticated ? "block" : "none"
    const recentLogs = document.getElementById('recent-logs');
    recentLogs!.style.display = globalThis.connectionStatus.authenticated ? "block" : "none"

    const tbody = mapTable?.querySelector('tbody');
    tbody!.innerHTML = ""
    for (const map of globalThis.gameState.maps) {
        const row = renderMap(map)
        tbody?.appendChild(row)
    }
}

export function renderMap(map: GACMap): HTMLTableRowElement {
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
    if (map.available) {
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

    bestMedalCell.innerHTML = map.bestSeed != "" ?
        `<a target="_blank" style="text-decoration: none;" href="https://geoguessr.com/game/${map.bestSeed}">${getMedalText(map.bestMedal)}</a>` :
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
    if (!map.available) {
        return DEFAULT_COLOR
    }

    switch (map.bestMedal) {
        case GACMedal.None:
            return LOGIC_COLOR
        case GACMedal.Bronze:
            if (map.gamemode & (GACGamemode.Move | GACGamemode.Pan)) {
                return LOGIC_COLOR
            } else {
                return OUT_OF_LOGIC_COLOR
            }
        case GACMedal.Silver:
            if (map.gamemode & (GACGamemode.Move & GACGamemode.Pan)) {
                return LOGIC_COLOR
            } else if (map.gamemode & GACGamemode.Move) {
                return OUT_OF_LOGIC_COLOR
            } else {
                return UNLIKELY_COLOR
            }
        case GACMedal.Gold:
            if (map.gamemode & (GACGamemode.Move & GACGamemode.Pan & GACGamemode.Zoom)) {
                return LOGIC_COLOR
            } else if (map.gamemode & (GACGamemode.Move & GACGamemode.Pan)) {
                return OUT_OF_LOGIC_COLOR
            } else if (map.gamemode & (GACGamemode.Move)) {
                return UNLIKELY_COLOR
            } else {
                return IMPOSSIBLE_COLOR
            }
        case GACMedal.Platinum:
            return DONE_COLOR
    }

    return DEFAULT_COLOR
}