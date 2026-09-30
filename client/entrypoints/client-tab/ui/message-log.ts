import type { MessageLog, MessageNode } from "archipelago.js";
import { RetrieveLogsMessage, SendNewLogMessage } from "../../common/messages";
import type { GACResponse } from "../../common/models";

type MessageLogEntry = {
    text: string;
    nodes: MessageNode[];
}

export function clearLogs() {
    const logs = document.getElementById("log-container")!;
    logs.innerHTML = ""
}

export function addLog(message: MessageLogEntry) {
    const logs = document.getElementById("log-container")!;
    const entry = document.createElement("div");
    entry.classList.add("log-text")
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message.text}`;

    logs.appendChild(entry);
    logs.scrollTop = logs.scrollHeight;
}

export async function initLogs() {
    const logMessage: RetrieveLogsMessage = new RetrieveLogsMessage()
    const logResponse: GACResponse = await browser.runtime.sendMessage(logMessage);

    if (logResponse.success) {
        const messageLog: MessageLog = logResponse.data
        console.log("Received log messages:", messageLog)
        clearLogs()
        messageLog.forEach((message: MessageLogEntry) => addLog(message))
    } else {
        console.error("Error while fetching logs:", logResponse.error)
    }
}

export function handleNewLogMessage(newLogMessage: SendNewLogMessage) {
    addLog({ text: newLogMessage.text, nodes: newLogMessage.nodes })
}