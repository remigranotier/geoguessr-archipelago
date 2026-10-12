import { SubmitManualIdMessage } from "../../common/messages";
import type { GACResponse } from "../../common/models";

export function initManualSubmitSection() {
    document.querySelector("#submit-id-button")!.addEventListener("click", submitManualGame)
    document.querySelector("#game-id")!.addEventListener("input", resetStatusSpan)
}

export async function submitManualGame(e: Event) {
    const gameId = document.querySelector<HTMLInputElement>("#game-id")?.value ?? "";
    const gameIdSubmitStatusSpan = document.querySelector<HTMLSpanElement>("#submit-id-status")!
    const idRegex = new RegExp('^[a-zA-Z0-9]{16}$')
    if (!idRegex.test(gameId)) {
        gameIdSubmitStatusSpan.style.color = "orange"
        gameIdSubmitStatusSpan.textContent = `⚠️ ${browser.i18n.getMessage("invalidIdFormat")}`
        return
    }
    const submitManualIdMessage: SubmitManualIdMessage = new SubmitManualIdMessage(gameId)
    const connectionResponse: GACResponse = await browser.runtime.sendMessage(submitManualIdMessage);
    if (connectionResponse.success) {
        console.debug("Manual submit success")
        gameIdSubmitStatusSpan.style.color = "green"
        gameIdSubmitStatusSpan.textContent = `✅ ${browser.i18n.getMessage("idAccepted")}`
    } else {
        console.error("Error while submitting manual challenge:", connectionResponse.error)
        gameIdSubmitStatusSpan.style.color = "red"
        gameIdSubmitStatusSpan.textContent = `❌ ${browser.i18n.getMessage("errorManualSubmit")}: ${connectionResponse.error}`
    }
}

export function resetStatusSpan() {
    const gameIdSubmitStatusSpan = document.querySelector<HTMLSpanElement>("#submit-id-status")!
    gameIdSubmitStatusSpan.style.color = "white"
    gameIdSubmitStatusSpan.textContent = ``
}