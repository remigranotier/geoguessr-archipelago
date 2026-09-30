import { apClient } from ".";
import { GACConnectionStatus } from "../common/models";
import { updateGameState } from "./game";
import type { ServerConnectMessage } from "../common/messages";

export async function handleServerConnectMessage(message: ServerConnectMessage) {
    console.log(`Connecting to ${message.serverUrl} with slot ${message.slotName}`)
    const slotData = await apClient.login(message.serverUrl, message.slotName, "Geoguessr")
    console.debug("Connection success on service worker")
    console.debug("Slot data is :", slotData)
    updateGameState()
    return slotData
}

export function getServerConnection(): GACConnectionStatus {
    return new GACConnectionStatus(apClient)
}

export function handleServerDisconnectMessage() {
    console.debug("Received ServerDisconnectMessage, disconnecting.")
    apClient.socket.disconnect()
}
