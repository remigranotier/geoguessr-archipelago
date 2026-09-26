import './style.css';

import { GACGamemode, GACGameState } from '../common/models.ts'
import { sendConnectionOptions } from './connection-form.ts';
import { renderMaps } from './maps.ts';
import { setNotConnected } from './status.ts';
import { getGameState } from './game-state.ts';

// Initialize global variables
declare global {
  var gameState: GACGameState
}
globalThis.gameState = { maps: [], globalGamemode: GACGamemode.None, globalTimerSeconds: 0 }


// Render pop-up
setNotConnected()
getGameState()
document.querySelector("#connect-form")!.addEventListener("submit", sendConnectionOptions)
renderMaps()
