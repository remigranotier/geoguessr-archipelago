import { Client, type MessageLog } from "archipelago.js";
import {
  GACConnectionStatus,
  GACGameState,
  type GACResponse,
} from "../common/models";
import { getServerConnection, handleServerConnectMessage, handleServerDisconnectMessage } from "./connect";
import { handleGameFinishedMessage, handleGenerateGameMessage, updateGameState } from "./game";
import { GenerateGameMessage, MessageType, RoundFinishedMessage, SendGameStateMessage, SendNewLogMessage, type GACMessage, type ServerConnectMessage } from "../common/messages";
import { handleRetrieveLogsMessage } from "./ap-logs";

export const apClient = new Client();
declare global {
  var gameState: GACGameState
  var connectionStatus: GACConnectionStatus
}

globalThis.gameState = { maps: [] }

function messageListener(message: GACMessage, sender: Browser.runtime.MessageSender, sendResponse: (response: GACResponse) => void) {
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
      console.debug("Received RetrieveConnectionStatus")
      sendResponse({
        success: true,
        data: getServerConnection()
      })
      return false;

    case MessageType.RetrieveGameState:
      console.debug("Received RetrieveGameState")
      sendResponse({
        success: true,
        data: globalThis.gameState
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
      console.debug("Received RoundFinishedMessage:", message)
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

    case MessageType.RetrieveLogs:
      console.debug("Received RetrieveLogsMessage")
      const messageLog: MessageLog = handleRetrieveLogsMessage()
      sendResponse({
        success: true,
        data: messageLog
      })
      return false;

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

  apClient.items.on("itemsReceived", (items) => {
    for (var item of items) {
      if (!item) {
        console.warn("Undefined item received, ignoring")
        continue
      }
      console.log(`New item received : ${item.name}`)
    }

    updateGameState()
    console.debug("Sending message SendGameStateMessage to client tab", globalThis.gameState)
    browser.runtime.sendMessage(new SendGameStateMessage(globalThis.gameState));
  })

  apClient.room.on("locationsChecked", (_locations) => {
    updateGameState()
    console.debug("Sending message SendGameStateMessage to client tab", globalThis.gameState)
    browser.runtime.sendMessage(new SendGameStateMessage(globalThis.gameState));
  })

  apClient.messages.on("message", (text, nodes) => {
    console.debug("Sending message SendNewLog to client tab")
    browser.runtime.sendMessage(new SendNewLogMessage(text, nodes));
  })
});
