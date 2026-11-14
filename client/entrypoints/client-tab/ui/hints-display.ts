import { getGameState } from "../game-state"
import type { GACHint } from "@/entrypoints/common/models"

const DEFAULT_COLOR = "rgb(36, 36, 36)"
const DONE_COLOR = "rgba(0, 255, 255, 0.3)"

export async function renderHintTable() {
    console.log("render hints !!!")
    let gameState = await getGameState()
    const hints = gameState.hints

    const hintsDiv = document.getElementById("hint-div")!
    const hidden = hints.length === 0 || !globalThis.connectionStatus.authenticated
    hintsDiv.hidden = hidden

    if(!hidden) {
        const hintTable = document.getElementById('hint-table')!
        const tbody = hintTable.querySelector('tbody')!
        tbody.innerHTML = ""

        for(let hint of hints) {
            const hintRow = renderHintRow(hint)
            tbody.appendChild(hintRow)
        }
    }
}

function renderHintRow(hint: GACHint): HTMLTableRowElement {
    const row = document.createElement("tr");

    const hintTextCell: HTMLTableCellElement = document.createElement("td")
    const foundCell: HTMLTableCellElement = document.createElement("td")

    hintTextCell.textContent = browser.i18n.getMessage("hintText", [hint.receiver, hint.itemName, hint.locationName, hint.sender])
    foundCell.textContent = hint.found ? "✔️" : "❌"
    row.style.backgroundColor = hint.found ? DONE_COLOR : DEFAULT_COLOR

    row.appendChild(hintTextCell)
    row.appendChild(foundCell)

    return row
}