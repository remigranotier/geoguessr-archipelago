import type { MessageNode } from "archipelago.js";
import { apClient } from ".";
import type { SendNewLogMessage } from "../common/messages";

export function handleRetrieveLogsMessage() {
    return apClient.messages.log
}