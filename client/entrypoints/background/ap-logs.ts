import { apClient } from ".";

export function handleRetrieveLogsMessage() {
    return apClient.messages.log
}