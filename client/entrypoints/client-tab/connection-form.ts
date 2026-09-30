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

export async function sendConnectionOptions(e: Event) {
    var server = document.querySelector<HTMLInputElement>("#server")?.value ?? DEFAULT_SERVER;
    var slotName = document.querySelector<HTMLInputElement>("#slot-name")?.value ?? DEFAULT_SLOT_NAME;
    storage.setItem("sync:connection", {
        server: server,
        slotName: slotName,
    })

    const connectMessage: ServerConnectMessage = new ServerConnectMessage(server, slotName)
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

export async function sendDisonnectCommand(e: Event) {
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