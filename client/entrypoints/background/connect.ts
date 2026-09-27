import { client } from ".";
import { GACConnectionStatus, type ServerConnectMessage } from "../common/models";

export async function handleServerConnectMessage(message: ServerConnectMessage) {
    console.log(`Connecting to ${message.serverUrl} with slot ${message.slotName}`)
    const slotData = await client.login(message.serverUrl, message.slotName, "Slay the Spire II")
    console.debug("Connection success on service worker")
    console.debug("Slot data is :", slotData)
    return slotData
}

export function getServerConnection(): GACConnectionStatus {
    return new GACConnectionStatus(client)
}
