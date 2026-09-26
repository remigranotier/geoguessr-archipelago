import { Client } from "archipelago.js";
import type { GACMessage, GACResponse, RoundFinishedMessage, ServerConnectMessage, SlotData } from "../common/models";
import { MessageType } from "../common/models";
import { handleServerConnectMessage } from "./connect";
import { handleGameFinishedMessage } from "./game-finished";

export const client = new Client();

function messageListener(message: GACMessage, sender: Browser.runtime.MessageSender, sendResponse: (response: GACResponse) => void) {
  console.debug("Received message:", message)
  switch (message.type) {
    case MessageType.ServerConnect:
      const serverConnectMessage = message as ServerConnectMessage;
      handleServerConnectMessage(serverConnectMessage).then(result => {
        sendResponse({
          success: true,
          data: result
        })
      }).catch(error => {
        sendResponse({
          success: false,
          error: error
        })
      });
      return true;

    case MessageType.ServerDisconnect:
      break;

    case MessageType.RoundFinished:
      const gameFinishedMessage = message as RoundFinishedMessage;
      handleGameFinishedMessage(gameFinishedMessage).then(result => {
        sendResponse({
          success: true,
          data: result
        })
      }).catch(error => {
        sendResponse({
          success: false,
          error: error
        })
      });
      return true;

    default:
      console.warn("Unknown message type received on service worker")
  }
}

export default defineBackground(async () => {
  browser.runtime.onMessage.addListener(messageListener)

  client.messages.on("message", (content) => {
    console.log(`AP_CLIENT - ${content}`);
  });
});
