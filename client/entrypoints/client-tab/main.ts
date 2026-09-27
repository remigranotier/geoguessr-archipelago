import './style.css';

import { GACConnectionStatus, GACGamemode, GACGameState } from '../common/models.ts'
import { sendConnectionOptions } from './connection-form.ts';
import { renderMaps } from './maps.ts';
import { getConnectionStatus, renderStatusComponent } from './status.ts';
import { getGameState } from './game-state.ts';

// Initialize global variables
declare global {
  var gameState: GACGameState
  var connectionStatus: GACConnectionStatus
}
globalThis.gameState = { maps: [], globalGamemode: GACGamemode.None, globalTimerSeconds: 0 }
globalThis.connectionStatus = { authenticated: false, player: "", server: "" }


// Render pop-up
getGameState()
renderStatusComponent()
getConnectionStatus()
document.querySelector("#connect-form")!.addEventListener("submit", sendConnectionOptions)
renderMaps()
