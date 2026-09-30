import './style.css';

import { GACConnectionStatus, GACGameState, type GACResponse } from '../common/models.ts'
import { sendConnectionOptions, sendDisonnectCommand, setCredentialsFromLastSend } from './connection-form.ts';
import { renderMaps } from './maps.ts';
import { getConnectionStatus, renderStatusComponent } from './status.ts';
import { getGameState, handleSendGameStateMessage } from './game-state.ts';
import { MessageType, SendGameStateMessage, type GACMessage } from '../common/messages.ts';

export const DEFAULT_CONNECTION_STATUS = { authenticated: false, player: "", server: "" }

// Initialize global variables
declare global {
  var gameState: GACGameState
  var connectionStatus: GACConnectionStatus
}
globalThis.gameState = { maps: [] }
globalThis.connectionStatus = DEFAULT_CONNECTION_STATUS

function clientTabMessageListener(message: GACMessage, sender: Browser.runtime.MessageSender, sendResponse: (response: GACResponse) => void) {
  switch (message.type) {
    case MessageType.SendGameState:
      const sendGameStateMessage = message as SendGameStateMessage;
      handleSendGameStateMessage(sendGameStateMessage)
      return false;
    default:
      console.warn("Unknown message type received on client tab")
      return
  }
}


// Render tab
getGameState()
renderStatusComponent()
getConnectionStatus()
setCredentialsFromLastSend()
document.querySelector("#connect-button")!.addEventListener("click", sendConnectionOptions)
document.querySelector("#disconnect-button")!.addEventListener("click", sendDisonnectCommand)
browser.runtime.onMessage.addListener(clientTabMessageListener)