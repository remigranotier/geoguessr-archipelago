import { Client } from "archipelago.js";
import { GACGamemode, GenerateGameMessage, type GACMap, type GACMessage, type GACResponse, type RoundFinishedMessage, type ServerConnectMessage } from "../common/models";
import { MessageType } from "../common/models";
import { handleServerConnectMessage } from "./connect";
import { handleGameFinishedMessage, handleGenerateGameMessage, handleRetrieveGameStateMessage } from "./game";

export const client = new Client();
export let maps: GACMap[] = [
  { id: "652ba0d9002aa0d36f996153", name: "An Official World", available: true, bestScore: 0 },
  { id: "62a44b22040f04bd36e8a914", name: "A Community World", available: false, bestScore: 0, timer: 400 },
  { id: "60aaef355f79500001032f71", name: "Intersectionguessr - France", available: true, bestScore: 0, gamemode: GACGamemode.Pan | GACGamemode.Zoom },
]
export let globalGamemode: GACGamemode = GACGamemode.None
export let globalTimerSeconds: number = 120

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

    case MessageType.RetrieveGameState:
      handleRetrieveGameStateMessage().then(result => {
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

    case MessageType.GenerateGame:
      const generateGame = message as GenerateGameMessage;
      handleGenerateGameMessage(generateGame).then(result => {
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

async function actionListener() {
  const clientTabUrl = browser.runtime.getURL("/client-tab.html")
  const tabs = await browser.tabs.query({
    url: clientTabUrl,
  });

  const existingTab = tabs[0];
  console.log(existingTab)

  if (existingTab?.id !== undefined) {
    await browser.tabs.update(existingTab.id, {
      active: true,
    });

    if (existingTab.windowId !== undefined) {
      await browser.windows.update(existingTab.windowId, {
        focused: true,
      });
    }

    return;
  }

  browser.tabs.create({
    url: clientTabUrl
  });
}

export default defineBackground(() => {
  browser.runtime.onMessage.addListener(messageListener)

  browser.action.onClicked.addListener(actionListener);

  client.messages.on("message", (content) => {
    console.log(`AP_CLIENT - ${content}`);
  });
});
