import { DEFAULT_SERVER, DEFAULT_SLOT_NAME, ServerConnectMessage, type GACResponse } from "../common/models";
import { storage } from '@wxt-dev/storage';
import { setConnected, setConnectionFailed, setConnectionInProgress } from "./status";

export async function sendConnectionOptions(e: Event) {
    e.preventDefault();
    var server = document.querySelector<HTMLInputElement>("#server")?.value ?? DEFAULT_SERVER;
    var slotName = document.querySelector<HTMLInputElement>("#slot-name")?.value ?? DEFAULT_SLOT_NAME;
    storage.setItem("sync:connection", {
        server: server,
        slotName: slotName,
    })

    const connectMessage: ServerConnectMessage = new ServerConnectMessage(server, slotName)
    setConnectionInProgress()
    const connectionResponse: GACResponse = await browser.runtime.sendMessage(connectMessage);
    if (connectionResponse.success) {
        console.log("Connection success")
        console.debug("Slot data received is:", connectionResponse.data)
        setConnected()
    } else {
        console.error("Error while connecting:", connectionResponse.error)
        setConnectionFailed()
    }
}