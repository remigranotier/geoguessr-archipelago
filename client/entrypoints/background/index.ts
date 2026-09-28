import { Client } from "archipelago.js";
import {
  GACConnectionStatus,
  GACGameState,
  GenerateGameMessage,
  type GACMessage,
  type GACResponse,
  type RoundFinishedMessage,
  type ServerConnectMessage,
  SendGameStateMessage
} from "../common/models";
import { MessageType } from "../common/models";
import { getServerConnection, handleServerConnectMessage, handleServerDisconnectMessage } from "./connect";
import { getCurrentGameState, handleGameFinishedMessage, handleGenerateGameMessage, updateGameState } from "./game";

export const apClient = new Client();
declare global {
  var gameState: GACGameState
  var connectionStatus: GACConnectionStatus
}

globalThis.gameState = { maps: [] }

function messageListener(message: GACMessage, sender: Browser.runtime.MessageSender, sendResponse: (response: GACResponse) => void) {
  console.debug("Received message:", message)

  switch (message.type) {
    case MessageType.ServerConnect:
      const serverConnectMessage = message as ServerConnectMessage;
      handleServerConnectMessage(serverConnectMessage).then(result => {
        sendResponse({
          success: true,
          data: {
            slotData: result,
            connectionStatus: new GACConnectionStatus(apClient),
            gameState: globalThis.gameState
          }
        })
      }).catch(error => {
        sendResponse({
          success: false,
          error: error
        })
      });
      return true;

    case MessageType.ServerDisconnect:
      handleServerDisconnectMessage();
      sendResponse({
        success: true,
        data: getServerConnection()
      })
      return false;

    case MessageType.RetrieveConnectionStatus:
      sendResponse({
        success: true,
        data: getServerConnection()
      })
      return false;

    case MessageType.RetrieveGameState:
      const gameState = getCurrentGameState()
      sendResponse({
        success: true,
        data: gameState
      })
      return false;

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

  apClient.messages.on("message", (content) => {
    console.log(`AP_CLIENT - ${content}`);
  });

  apClient.items.on("itemsReceived", (items)=>{
    for (var item of items) {

      if (!item) {
        console.log("Undefined item received")
        continue
      }
      console.log(`New item received : ${item.name}`)
    }

    updateGameState()
    browser.runtime.sendMessage(new SendGameStateMessage(globalThis.gameState));
    })
});
