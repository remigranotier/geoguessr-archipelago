import { RetrieveConnectionStatusMessage } from "../../common/messages";
import {
    GACConnectionStatus,
    StatusSpecialMode,
    type GACResponse
} from "../../common/models"
import { DEFAULT_CONNECTION_STATUS } from "../main";
import { renderGameSection } from "./maps";

export async function getConnectionStatus() {
    const retrieveConnectionStatusMessage = new RetrieveConnectionStatusMessage()

    const response: GACResponse = await browser.runtime.sendMessage(retrieveConnectionStatusMessage);
    if (response.success) {
        const connectionStatus: GACConnectionStatus = response.data
        console.debug("Retrieved connection status successfully:", connectionStatus)
        updateConnectionStatus(connectionStatus)
    } else {
        console.error("Error while retrieving connection status from service worker", response.error)
    }
}

export function updateConnectionStatus(connectionStatus: GACConnectionStatus) {
    globalThis.connectionStatus = connectionStatus
    renderStatusComponent()
}

export function resetConnectionStatus() {
    globalThis.connectionStatus = DEFAULT_CONNECTION_STATUS
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