import { GACGamemode, GACMap, GenerateGameMessage } from "../common/models";

export function renderMaps() {
    const mapTable = document.getElementById('map-table');
    mapTable!.style.display = globalThis.connectionStatus.authenticated ? "block" : "none"

    const tbody = mapTable?.querySelector('tbody');
    tbody!.innerHTML = ""
    for (var map of globalThis.gameState.maps) {
        const row = renderMap(map)
        tbody?.appendChild(row)
    }
}

export function renderMap(map: GACMap): HTMLTableRowElement {
    const row = document.createElement("tr");
    const mapNameCell: HTMLTableCellElement = document.createElement("td")
    const gamemodeCell: HTMLTableCellElement = document.createElement("td")
    const timerCell: HTMLTableCellElement = document.createElement("td")
    const bestScoreCell: HTMLTableCellElement = document.createElement("td")
    const availableCell: HTMLTableCellElement = document.createElement("td")

    const currentGamemode: GACGamemode = map.gamemode ?? globalThis.gameState.globalGamemode;
    const currentTimer: number = map.timer ?? globalThis.gameState.globalTimerSeconds;

    mapNameCell.textContent = map.name;
    if (map.available) {
        mapNameCell.classList.add("activeLink")
        mapNameCell.onclick = (_: PointerEvent) => {
            const generateGameMessage = new GenerateGameMessage(map.id)
            browser.runtime.sendMessage(generateGameMessage).catch((error) => {
                console.error("Error while generating game:", error)
            });
        }
    } else {
        mapNameCell.classList.add("inactiveLink")
    }


    gamemodeCell.textContent = `${currentGamemode & GACGamemode.Move ? "" : "No "}Move, ${currentGamemode & GACGamemode.Pan ? "" : "No "}Pan, ${currentGamemode & GACGamemode.Zoom ? "" : "No "}Zoom`

    if (currentTimer == 0) {
        timerCell.textContent = "No Time"
    } else {
        const minutes = Math.floor(currentTimer / 60)
        const seconds = currentTimer % 60
        timerCell.textContent = `${minutes > 0 ? minutes + "min" : ""}${seconds > 0 ? seconds + "s" : ""}`
    }

    bestScoreCell.textContent = map.bestScore.toString()

    availableCell.textContent = map.available ? "yes" : "no"

    row.appendChild(mapNameCell)
    row.appendChild(gamemodeCell)
    row.appendChild(timerCell)
    row.appendChild(bestScoreCell)
    row.appendChild(availableCell)

    return row
}