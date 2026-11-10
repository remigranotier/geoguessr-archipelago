import { StatusSpecialMode } from "../../common/models"
import { resetConnectionStatus } from "../status";
import { renderGameSection } from "./maps";

function getStatusComponent() {
    return document.querySelector("#status")!
}

export function renderStatusComponent(specialMode?: StatusSpecialMode) {
    const statusComponent = getStatusComponent()

    if (statusComponent.getAttribute("loading") == "true") {
        // The special mode should be cleared before allowing change of status
        return
    }
    if (specialMode !== undefined) {
        switch (specialMode) {
            case StatusSpecialMode.Loading:
                statusComponent.innerHTML = `⌛ ${browser.i18n.getMessage("connectingStatus")}...`
                statusComponent.setAttribute("loading", "true")
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

export function clearLoadingState() {
    const statusComponent = getStatusComponent()
    if (statusComponent.hasAttribute("loading")) {
        statusComponent.removeAttribute("loading")
    }
}