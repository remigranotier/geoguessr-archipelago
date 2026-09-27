import { GACConnectionStatus, RetrieveConnectionStatusMessage, StatusSpecialMode, type GACResponse } from "../common/models"

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

export function renderStatusComponent(specialMode?: StatusSpecialMode) {
    const statusComponent = document.querySelector("#status")!
    if (specialMode !== undefined) {
        switch (specialMode) {
            case StatusSpecialMode.Loading:
                statusComponent.innerHTML = `Connecting...`
                return;
            case StatusSpecialMode.Failed:
                statusComponent.innerHTML = `Failed connecting. Press F12 to see details in console.`
                return;
        }
    }

    if (globalThis.connectionStatus.authenticated) {
        statusComponent.innerHTML = `✅ Connected to <strong>${globalThis.connectionStatus.server}</strong> as <strong>${globalThis.connectionStatus.player}</strong>`
    } else {
        statusComponent.innerHTML = `❌ Not connected`
    }
}