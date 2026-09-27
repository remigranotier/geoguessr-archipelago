import { client } from ".";
import { GACConnectionStatus, type ServerConnectMessage } from "../common/models";
import { updateGameState } from "./game";

export async function handleServerConnectMessage(message: ServerConnectMessage) {
    console.log(`Connecting to ${message.serverUrl} with slot ${message.slotName}`)
    const slotData = await client.login(message.serverUrl, message.slotName, "Geoguessr")
    console.debug("Connection success on service worker")
    console.debug("Slot data is :", slotData)
    updateGameState(client)
    return slotData
}

export function getServerConnection(): GACConnectionStatus {
    return new GACConnectionStatus(client)
}

export function handleServerDisconnectMessage() {
    client.socket.disconnect()
}
