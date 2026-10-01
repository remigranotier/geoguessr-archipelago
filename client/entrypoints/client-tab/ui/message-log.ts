import { RetrieveLogsMessage, SendNewLogMessage } from "../../common/messages";
import type { GACResponse } from "../../common/models";

export function clearLogs() {
    const logs = document.getElementById("log-container")!;
    logs.innerHTML = ""
}

export function addLog(htmlContent: string) {
    const logs = document.getElementById("log-container")!;
    const entry = document.createElement("div");
    entry.classList.add("log-text")
    entry.innerHTML = `[${new Date().toLocaleTimeString()}] ${htmlContent}`;

    logs.appendChild(entry);
    logs.scrollTop = logs.scrollHeight;
}

export async function initLogs() {
    const logMessage: RetrieveLogsMessage = new RetrieveLogsMessage()
    const logResponse: GACResponse = await browser.runtime.sendMessage(logMessage);

    if (logResponse.success) {
        const messageLog = logResponse.data
        console.log("Received log messages:", messageLog)
        clearLogs()
        messageLog.forEach((message: string) => addLog(message))
    } else {
        console.error("Error while fetching logs:", logResponse.error)
    }
}

export function handleNewLogMessage(newLogMessage: SendNewLogMessage) {
    addLog(newLogMessage.htmlContent)
}