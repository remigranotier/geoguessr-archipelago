import type { ConnectionOptions } from "archipelago.js";
import { apClient } from ".";
import { GACConnectionStatus } from "../common/models";
import type { ServerConnectMessage } from "../common/messages";
import { updateGameState } from "./state";

export async function handleServerConnectMessage(message: ServerConnectMessage) {
    console.log(`Connecting to ${message.serverUrl} with slot ${message.slotName}`)
    let connectionOptions: ConnectionOptions = { password: message.password }
    const slotData = await apClient.login(message.serverUrl, message.slotName, "Geoguessr", connectionOptions)
    console.debug("Connection success on service worker")
    console.debug("Slot data is :", slotData)

    globalThis.gameConfigData = slotData
    void updateGameState()

    return slotData
}

export function getServerConnection(): GACConnectionStatus {
    return new GACConnectionStatus()
}

export function handleServerDisconnectMessage() {
    console.debug("Received ServerDisconnectMessage, disconnecting.")
    apClient.socket.disconnect()
}
