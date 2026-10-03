import { Client } from "archipelago.js";
import {
  FillerItemId,
  GACConnectionStatus,
  GACGameState,
  SoundEffectType,
  type GACResponse,
} from "../common/models";
import { getServerConnection, handleServerConnectMessage, handleServerDisconnectMessage } from "./connect";
import { handleGameFinishedMessage, handleGenerateGameMessage, updateGameState } from "./game";
import { GenerateGameMessage, MessageType, RoundFinishedMessage, SendGameStateMessage, SendNewLogMessage, SendSoundEffectMessage, type GACMessage, type ServerConnectMessage } from "../common/messages";
import { handleRetrieveLogsMessage, renderNodes } from "./ap-logs";
import { sendQuestionableTip, sendSpecialTip } from "./tips";

export const apClient = new Client();
declare global {
  var gameState: GACGameState
  var gameConfigData: Record<string, unknown>
}

globalThis.gameState = { maps: [] }

function messageListener(message: GACMessage, sender: Browser.runtime.MessageSender, sendResponse: (response: GACResponse) => void) {
  switch (message.type) {
    case MessageType.ServerConnect:
      {
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
      }

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
      {
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
      }

    case MessageType.RoundFinished:
      {
        const gameFinishedMessage = message as RoundFinishedMessage;
        console.debug("Received RoundFinishedMessage:", message)
        const result = handleGameFinishedMessage(gameFinishedMessage)
        sendResponse({
          success: true,
          data: result
        })
        return false;
      }

    case MessageType.RetrieveLogs:
      {
        console.debug("Received RetrieveLogsMessage")
        const messageLogJson: string[] = handleRetrieveLogsMessage()
        sendResponse({
          success: true,
          data: messageLogJson
        })
        return false;
      }

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

  await browser.tabs.create({
    url: clientTabUrl
  });
}

export default defineBackground(() => {
  browser.runtime.onMessage.addListener(messageListener)

  browser.action.onClicked.addListener(actionListener);

  apClient.items.on("itemsReceived", (items, startingIndex) => {
    console.debug("Starting item index is", startingIndex)

    // If startingIndex is 0 it means that it's a new connection and the server sends the whole inventory
    if (startingIndex > 0) {
      for (let item of items) {
        console.debug(`New item received : ${item.name}`)
        if (item.id == FillerItemId.SpecialTip) {
          sendSpecialTip()
        }
        if (item.id == FillerItemId.QuestionableTip) {
          sendQuestionableTip()
        }
      }
    }

    updateGameState()
    console.debug("Sending message SendGameStateMessage to client tab", globalThis.gameState)
    void browser.runtime.sendMessage(new SendGameStateMessage(globalThis.gameState));

    // Send a sound effect only on an item coming from another player and not on connection
    if (items.some((item) => item.sender.name != apClient.players.self.name) && startingIndex > 0) {
      console.debug("Sending message SendSoundEffectMessage to client tab with type ItemReceived")
      void browser.runtime.sendMessage(new SendSoundEffectMessage(SoundEffectType.ItemReceived))
    }
  })

  apClient.room.on("locationsChecked", (_locations) => {
    updateGameState()
    console.debug("Sending message SendGameStateMessage to client tab", globalThis.gameState)
    void browser.runtime.sendMessage(new SendGameStateMessage(globalThis.gameState));
  })

  apClient.messages.on("message", (_text, nodes) => {
    void browser.runtime.sendMessage(new SendNewLogMessage(renderNodes(nodes)));
  })
});
