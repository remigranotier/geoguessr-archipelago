import {
    GACConnectionStatus,
    GACGameState,
    StatusSpecialMode,
    type GACResponse
} from "../common/models";
import { storage } from '@wxt-dev/storage';
import { renderStatusComponent } from "./status";
import { setInternalGameState } from "./game-state";
import { ServerConnectMessage, ServerDisconnectMessage } from "../common/messages";

type ConnectionCredentials = {
    server: string,
    slotName: string,
}

export function setCredentialsFromLastSend() {
    storage.getItem<ConnectionCredentials>("sync:connection").then((previousCredentials) => {
        if (previousCredentials === null) {
            console.debug("No previous credentials, ignoring")
            return
        }
        var serverField = document.querySelector<HTMLInputElement>("#server")!
        serverField.value = previousCredentials.server
        var slotNameField = document.querySelector<HTMLInputElement>("#slot-name")!
        slotNameField.value = previousCredentials.slotName
    })
}

export async function sendConnectionOptions(e: Event) {
    var server = document.querySelector<HTMLInputElement>("#server")?.value ?? "";
    var slotName = document.querySelector<HTMLInputElement>("#slot-name")?.value ?? "";
    var password = document.querySelector<HTMLInputElement>("#password")?.value ?? "";
    storage.setItem("sync:connection", {
        server: server,
        slotName: slotName,
    })

    const connectMessage: ServerConnectMessage = new ServerConnectMessage(server, slotName, password)
    renderStatusComponent(StatusSpecialMode.Loading)
    const connectionResponse: GACResponse = await browser.runtime.sendMessage(connectMessage);
    if (connectionResponse.success) {
        console.log("Connection success")
        let { slotData, connectionStatus, gameState }: { slotData: any, connectionStatus: GACConnectionStatus, gameState: GACGameState } = connectionResponse.data
        console.debug("Slot data received is:", slotData)
        console.debug("Connection status received is:", connectionStatus)
        globalThis.connectionStatus = connectionStatus
        setInternalGameState(gameState)
        renderStatusComponent()
    } else {
        console.error("Error while connecting:", connectionResponse.error)
        renderStatusComponent(StatusSpecialMode.Failed)
    }
}

export async function sendDisconnectCommand(e: Event) {
    storage.setItem("sync:connection", {
        server: "",
        slotName: "",
    })

    const disconnectMessage: ServerDisconnectMessage = new ServerDisconnectMessage()
    renderStatusComponent(StatusSpecialMode.Loading)
    const disconnectResponse: GACResponse = await browser.runtime.sendMessage(disconnectMessage);
    if (disconnectResponse.success) {
        let connectionStatus: GACConnectionStatus = disconnectResponse.data
        console.debug("Connection status received is:", connectionStatus)
        globalThis.connectionStatus = connectionStatus
        renderStatusComponent()
    } else {
        console.error("Error while disconnecting:", disconnectResponse.error)
        renderStatusComponent(StatusSpecialMode.Failed)
    }
}