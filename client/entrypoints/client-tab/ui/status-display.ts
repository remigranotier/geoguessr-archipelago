import { StatusSpecialMode } from "../../common/models"
import { resetConnectionStatus } from "../status";
import { renderGameSection } from "./maps";

export function renderStatusComponent(specialMode?: StatusSpecialMode) {
    const statusComponent = document.querySelector("#status")!
    if (specialMode !== undefined) {
        switch (specialMode) {
            case StatusSpecialMode.Loading:
                statusComponent.innerHTML = `⌛ ${browser.i18n.getMessage("connectingStatus")}...`
                break;
            case StatusSpecialMode.Failed:
                statusComponent.innerHTML = `⚠️ ${browser.i18n.getMessage("failedConnectionStatus")}`
                resetConnectionStatus()
                break;
            default:
                console.error("Unknown special mode while rendering status component")
                break;
        }
    } else if (globalThis.connectionStatus.authenticated) {
        statusComponent.innerHTML = `✅ ${browser.i18n.getMessage("connectedStatus", [globalThis.connectionStatus.server, globalThis.connectionStatus.player])}`
    } else {
        statusComponent.innerHTML = `❌ ${browser.i18n.getMessage("notConnectedStatus")}`
    }

    renderGameSection()
}