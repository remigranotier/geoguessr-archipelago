import { GACGamemode, GACMap, GACMedal, GenerateGameMessage } from "../common/models";

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
    const bestMedalCell: HTMLTableCellElement = document.createElement("td")
    const fivekCell: HTMLTableCellElement = document.createElement("td")

    const currentGamemode: GACGamemode = map.gamemode;

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

    bestMedalCell.textContent = getMedalText(map.bestMedal)

    fivekCell.textContent = map.fivekDone ? "✅" : "❌"

    row.appendChild(mapNameCell)
    row.appendChild(gamemodeCell)
    row.appendChild(bestMedalCell)
    row.appendChild(fivekCell)

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
            return "🙈"
    }
}