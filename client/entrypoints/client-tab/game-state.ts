import { GACGameState, RetrieveGameStateMessage, type GACResponse, SendGameStateMessage } from "../common/models";
import { renderMaps } from "./maps";

export async function getGameState() {
    const retrieveGameStateMessage = new RetrieveGameStateMessage()

    const response: GACResponse = await browser.runtime.sendMessage(retrieveGameStateMessage);
    if (response.success) {
        const gameState: GACGameState = response.data
        console.debug("Retrieved game state successfully", gameState)
        setInternalGameState(gameState)
    } else {
        console.error("Error while retrieving game state from service worker", response.error)
    }
}

export function handleSendGameStateMessage(sendGameStateMessage: SendGameStateMessage) {
    setInternalGameState(sendGameStateMessage.gameState)
}

export function setInternalGameState(newGameState: GACGameState) {
    globalThis.gameState = newGameState
    renderMaps()
}