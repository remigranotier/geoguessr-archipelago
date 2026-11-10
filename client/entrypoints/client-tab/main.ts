import './style.css';

import { GACConnectionStatus, GACGameState, type GACResponse } from '../common/models.ts'
import { sendConnectionOptions, sendDisconnectCommand, setCredentialsFromLastSend } from './ui/connection-form.ts';
import { renderStatusComponent } from './ui/status-display.ts';
import { HeartbeatMessage, MessageType, SendConnectionStatusMessage, SendNewLogMessage, SendSoundEffectMessage, type GACMessage } from '../common/messages.ts';
import { handleNewLogMessage, initLogs } from './ui/message-log.ts';
import { initVolumeBar, playSoundEffect } from './ui/sound-effect.ts';
import { resolveI18n } from '../common/i18n.ts';
import { initManualSubmitSection } from './ui/manual-id-submit.ts';
import { getConnectionStatus, updateConnectionStatus } from './status.ts';

export const DEFAULT_CONNECTION_STATUS = { authenticated: false, player: "", server: "", seed: "" }

// Initialize global variables
declare global {
  var gameState: GACGameState
  var connectionStatus: GACConnectionStatus
}
globalThis.gameState = new GACGameState()
globalThis.connectionStatus = DEFAULT_CONNECTION_STATUS

function clientTabMessageListener(message: GACMessage, sender: Browser.runtime.MessageSender, sendResponse: (response: GACResponse) => void) {
  switch (message.type) {
    case MessageType.SendNewLog:
      {
        const newLogMessage = message as SendNewLogMessage;
        handleNewLogMessage(newLogMessage)
        return false;
      }
    case MessageType.SendSoundEffect:
      {
        const newSoundEffectMessage = message as SendSoundEffectMessage;
        playSoundEffect(newSoundEffectMessage.soundType)
        return false;
      }
    case MessageType.SendConnectionStatus:
      {
        const newConnectionStatus = message as SendConnectionStatusMessage;
        void updateConnectionStatus(newConnectionStatus.connectionStatus)
        return false;
      }
    default:
      console.debug("Unknown message type received on client tab, ignoring.")
      return
  }
}


// Render tab
renderStatusComponent()
setCredentialsFromLastSend()
void getConnectionStatus()
void initLogs()
initVolumeBar()
void Notification.requestPermission()
document.querySelector("#connect-button")!.addEventListener("click", sendConnectionOptions)
document.querySelector("#disconnect-button")!.addEventListener("click", sendDisconnectCommand)
initManualSubmitSection()
browser.runtime.onMessage.addListener(clientTabMessageListener)
document.addEventListener("DOMContentLoaded", resolveI18n);

// Periodically get connection status
setInterval(async () => {
  const connectionResponse: GACResponse = await browser.runtime.sendMessage(new HeartbeatMessage())
  if (connectionResponse.success) {
    let connectionStatus: GACConnectionStatus = connectionResponse.data
    // console.debug("HEARTBEAT - Connection status received is:", connectionStatus)

    // Only update connection status if tab thinks client is authenticated.
    // If tab thinks it's not authenticated player can manually reconnect anyway.
    if (globalThis.connectionStatus.authenticated) {
      void updateConnectionStatus(connectionStatus)
    }
  } else {
    console.error("Error while sending heartbeat message:", connectionResponse.error)
  }
}, 10000)