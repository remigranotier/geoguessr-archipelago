import { NUMBER_OF_ROUNDS, PERFECT_SCORE } from "@/entrypoints/common/config/area-map"
import { GACMedal } from "@/entrypoints/common/config/medals"
import { RoundFinishedMessage } from "@/entrypoints/common/messages"
import { GACGameType, GeoguessrGameStatus, type GACMap, type GACResponse } from "@/entrypoints/common/models"
import { getMedalText } from "./maps"

export function renderDebugOptions(map: GACMap) {
    let debugCell: HTMLTableCellElement = document.createElement("td")

    debugCell.appendChild(createMedalDebugButton(map, GACMedal.Bronze))
    debugCell.appendChild(createMedalDebugButton(map, GACMedal.Silver))
    debugCell.appendChild(createMedalDebugButton(map, GACMedal.Gold))
    if (globalThis.gameState.configData.include_platinums) {
        debugCell.appendChild(createMedalDebugButton(map, GACMedal.Platinum))
    }

    debugCell.appendChild(createFiveKDebugButton(map))

    return debugCell
}

function createMedalDebugButton(map: GACMap, medalLevel: GACMedal) {
    let button: HTMLButtonElement = document.createElement("button")
    button.textContent = getMedalText(medalLevel)
    button.onclick = async (_event) => {
        const roundFinishedMessage = new RoundFinishedMessage(
            GeoguessrGameStatus.FINISHED,
            "randomexamplevalue",
            GACGameType.Game,
            map.gamemode,
            map.id,
            map.name,
            0,
            NUMBER_OF_ROUNDS,
            map.medalThresholds[medalLevel],
        )
        const roundFinishedResponse: GACResponse = await browser.runtime.sendMessage(roundFinishedMessage)
        console.debug("[DEBUG] RoundFinishedMessage correctly sent")
        if (!roundFinishedResponse.success) {
            console.error("[DEBUG] Error while sending RoundFinishedMessage:", roundFinishedResponse.error)
        }
    }

    return button
}

function createFiveKDebugButton(map: GACMap) {
    let button: HTMLButtonElement = document.createElement("button")
    button.textContent = "5k"
    button.onclick = async (_event) => {
        const roundFinishedMessage = new RoundFinishedMessage(
            GeoguessrGameStatus.FINISHED,
            "randomexamplevalue",
            GACGameType.Game,
            map.gamemode,
            map.id,
            map.name,
            PERFECT_SCORE,
            NUMBER_OF_ROUNDS,
            0,
        )
        const roundFinishedResponse: GACResponse = await browser.runtime.sendMessage(roundFinishedMessage)
        console.debug("[DEBUG] RoundFinishedMessage correctly sent")
        if (!roundFinishedResponse.success) {
            console.error("[DEBUG] Error while sending RoundFinishedMessage:", roundFinishedResponse.error)
        }
    }

    return button
}