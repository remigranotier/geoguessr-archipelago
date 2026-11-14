import { Client } from "archipelago.js";
import {
  FillerItemId,
  SoundEffectType,
  type GACResponse,
} from "../common/models";
import { getServerConnection, handleServerConnectMessage, handleServerDisconnectMessage, tryReconnection } from "./connect";
import { handleRoundFinishedMessage, handleGenerateGameMessage } from "./game";
import { DataConflictMessage, GenerateGameMessage, MessageType, RoundFinishedMessage, SendConnectionStatusMessage, SendNewLogMessage, SendSoundEffectMessage, SubmitManualIdMessage, type GACMessage, type ServerConnectMessage } from "../common/messages";
import { handleRetrieveLogsMessage, renderNodes } from "./ap-logs";
import { sendQuestionableTip, sendSpecialTip } from "./tips";
import { retrieveHint } from "./hints";
import { handleSubmitManualId } from "./manual-submit";
import { handleDataConflict, updateGameState } from "./state";

export const apClient = new Client();
declare global {
  var gameConfigData: Record<string, unknown>
}

function messageListener(message: GACMessage, sender: Browser.runtime.MessageSender, sendResponse: (response: GACResponse) => void) {
  switch (message.type) {
    case MessageType.Heartbeat:
      {
        sendResponse({
          success: true,
          data: getServerConnection()
        })
        return false;
      }
    case MessageType.ServerConnect:
      {
        const serverConnectMessage = message as ServerConnectMessage;
        handleServerConnectMessage(serverConnectMessage).then(() => {
          sendResponse({
            success: true,
            data: {
              connectionStatus: getServerConnection(),
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
        const roundFinishedMessage = message as RoundFinishedMessage;
        console.debug("Received RoundFinishedMessage:", message);
        handleRoundFinishedMessage(roundFinishedMessage).then(result => {
          sendResponse({
            success: true,
            data: result
          })
        }).catch(e => {
          sendResponse({
            success: false,
            error: (e as Error).message
          })
        })
        return true;
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

    case MessageType.SubmitManualId:
      {
        const submitManualId = message as SubmitManualIdMessage;
        handleSubmitManualId(submitManualId).then(result => {
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

    case MessageType.DataConflict:
      {
        const dataConflictMessage = message as DataConflictMessage;
        void handleDataConflict(dataConflictMessage)
        sendResponse({
          success: true,
          data: {}
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

function setupClientDebugMessages() {
  apClient.socket.on("connected", (_packet) => {
    console.debug(`CLIENT - CONNECTED`)
    void browser.runtime.sendMessage(new SendConnectionStatusMessage(getServerConnection()))
  })

  apClient.socket.on("disconnected", () => {
    console.debug(`CLIENT - DISCONNECTED`)
    void browser.runtime.sendMessage(new SendConnectionStatusMessage(getServerConnection()))
  })
}

export default defineBackground(() => {
  setupClientDebugMessages()
  void tryReconnection()

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
        if (item.id == FillerItemId.Hint) {
          void retrieveHint()
        }
      }
    }

    void updateGameState()

    // Send a sound effect only on an item coming from another player and not on connection
    if (items.some((item) => item.sender.name != apClient.players.self.name) && startingIndex > 0) {
      console.debug("Sending message SendSoundEffectMessage to client tab with type ItemReceived")
      void browser.runtime.sendMessage(new SendSoundEffectMessage(SoundEffectType.ItemReceived))
    }
  })

  apClient.room.on("locationsChecked", (_locations) => {
    void updateGameState()
  })

  apClient.messages.on("message", (_text, nodes) => {
    void browser.runtime.sendMessage(new SendNewLogMessage(renderNodes(nodes)));
  })

  apClient.deathLink.on("deathReceived", (_source, _time, _cause) => {
    if (!apClient.deathLink.enabled) {
      return
    }

    void browser.runtime.sendMessage(new SendSoundEffectMessage(SoundEffectType.DeathReceived))
    void storage.setItem<boolean>("local:death-link", true)
    setTimeout(() => {
      void storage.setItem("local:death-link", null)
    }, 1000)
  })

  // Keep service worker alive
  setInterval(() => {
    if (apClient.authenticated) {
      apClient.socket.send({ cmd: "Get", keys: [] })
    }
  }, 20000)
});
