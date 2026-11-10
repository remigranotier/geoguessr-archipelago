import type { ConnectionOptions } from "archipelago.js";
import { apClient } from ".";
import { GACConnectionStatus, type ConnectionCredentials } from "../common/models";
import { ServerConnectMessage } from "../common/messages";
import { updateGameState } from "./state";

export async function handleServerConnectMessage(message: ServerConnectMessage) {
    console.log(`Connecting to ${message.serverUrl} with slot ${message.slotName}`)
    let connectionOptions: ConnectionOptions = { password: message.password }
    const slotData = await apClient.login(message.serverUrl, message.slotName, "Geoguessr", connectionOptions)
    console.debug("Connection success on service worker")
    console.debug("Slot data is :", slotData)

    globalThis.gameConfigData = slotData

    if (slotData.deathlink_enabled == 1) {
        apClient.deathLink.enableDeathLink()
    } else {
        apClient.deathLink.disableDeathLink()
    }
    void updateGameState()
}

export function getServerConnection(): GACConnectionStatus {
    return new GACConnectionStatus()
}

export function handleServerDisconnectMessage() {
    console.debug("Received ServerDisconnectMessage, disconnecting.")
    apClient.socket.disconnect()
}

export async function tryReconnection() {
    const credentials = await storage.getItem<ConnectionCredentials>(`sync:connection`)
    if (credentials === null) {
        console.debug("No previous credentials, not reconnecting")
        return
    }

    void handleServerConnectMessage(new ServerConnectMessage(credentials.server, credentials.slotName, credentials.password))
}