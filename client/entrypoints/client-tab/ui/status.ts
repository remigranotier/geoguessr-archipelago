import { DataConflictMessage, RetrieveConnectionStatusMessage } from "../../common/messages";
import {
    GACConnectionStatus,
    GACGameState,
    StatusSpecialMode,
    type GACResponse
} from "../../common/models"
import { getGameState } from "../game-state";
import { DEFAULT_CONNECTION_STATUS } from "../main";
import { renderGameSection } from "./maps";

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

function resetConnectionStatus() {
    globalThis.connectionStatus = DEFAULT_CONNECTION_STATUS
    storage.unwatch()
}

export function renderStatusComponent(specialMode?: StatusSpecialMode) {
    const statusComponent = document.querySelector("#status")!
    if (specialMode !== undefined) {
        switch (specialMode) {
            case StatusSpecialMode.Loading:
                statusComponent.innerHTML = `⌛ ${browser.i18n.getMessage("connectingStatus")}...`
                break;
            case StatusSpecialMode.Failed:
                statusComponent.innerHTML = `⚠️ ${browser.i18n.getMessage("failedConnectionStatus")}`
                resetConnectionStatus()
                break;
            default:
                console.error("Unknown special mode while rendering status component")
                break;
        }
    } else if (globalThis.connectionStatus.authenticated) {
        statusComponent.innerHTML = `✅ ${browser.i18n.getMessage("connectedStatus", [globalThis.connectionStatus.server, globalThis.connectionStatus.player])}`
    } else {
        statusComponent.innerHTML = `❌ ${browser.i18n.getMessage("notConnectedStatus")}`
    }

    renderGameSection()
}