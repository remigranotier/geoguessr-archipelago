import { DEFAULT_SERVER, DEFAULT_SLOT_NAME, GACConnectionStatus, ServerConnectMessage, StatusSpecialMode, type GACResponse } from "../common/models";
import { storage } from '@wxt-dev/storage';
import { renderStatusComponent } from "./status";

export async function sendConnectionOptions(e: Event) {
    e.preventDefault();
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
        let { slotData, connectionStatus }: { slotData: any, connectionStatus: GACConnectionStatus } = connectionResponse.data
        console.debug("Slot data received is:", slotData)
        console.debug("Connection status received is:", connectionStatus)
        globalThis.connectionStatus = connectionStatus
        renderStatusComponent()
    } else {
        console.error("Error while connecting:", connectionResponse.error)
        renderStatusComponent(StatusSpecialMode.Failed)
    }
}