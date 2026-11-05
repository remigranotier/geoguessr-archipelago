import { DataConflictMessage, RetrieveConnectionStatusMessage } from "../common/messages";
import {
    GACConnectionStatus,
    GACGameState,
    type GACResponse
} from "../common/models"
import { getGameState } from "./game-state";
import { DEFAULT_CONNECTION_STATUS } from "./main";
import { renderGameSection } from "./ui/maps";
import { renderStatusComponent } from "./ui/status-display";


export async function getConnectionStatus() {
    const retrieveConnectionStatusMessage = new RetrieveConnectionStatusMessage()

    const response: GACResponse = await browser.runtime.sendMessage(retrieveConnectionStatusMessage);
    if (response.success) {
        const connectionStatus: GACConnectionStatus = response.data
        console.debug("Retrieved connection status successfully:", connectionStatus)
        void updateConnectionStatus(connectionStatus)
    } else {
        console.error("Error while retrieving connection status from service worker", response.error)
    }
}

export async function updateConnectionStatus(connectionStatus: GACConnectionStatus) {
    if (globalThis.connectionStatus.authenticated == connectionStatus?.authenticated &&
        globalThis.connectionStatus.player == connectionStatus?.player &&
        globalThis.connectionStatus.seed == connectionStatus?.seed &&
        globalThis.connectionStatus.server == connectionStatus?.server) {
        // console.debug("No need to update connection status, nothing changed")
        return
    }

    storage.unwatch()
    globalThis.connectionStatus = connectionStatus

    if (connectionStatus.authenticated) {
        storage.watch<GACGameState>(`local:${connectionStatus.seed}-${connectionStatus.player}`, (newGameState, _oldGameState) => {
            globalThis.gameState = newGameState ?? new GACGameState()
            renderGameSection()
        })
        const gameState = await getGameState()
        globalThis.gameState = gameState
        if (gameState.url != "" && gameState.url != connectionStatus.server) {
            let clearPreviousData = gameState.gameFinished ? true : confirm(browser.i18n.getMessage("clearPreviousDataPopupMessage", gameState.url))
            void browser.runtime.sendMessage(new DataConflictMessage(clearPreviousData))
        }
    }

    renderStatusComponent()
}

export function resetConnectionStatus() {
    globalThis.connectionStatus = DEFAULT_CONNECTION_STATUS
    storage.unwatch()
}