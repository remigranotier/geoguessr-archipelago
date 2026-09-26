import './style.css';

import { GACGamemode, GACMap } from '../common/models.ts'
import { sendConnectionOptions } from './connection-form.ts';
import { renderMaps } from './maps.ts';
import { setNotConnected } from './status.ts';

// Initialize global variables
export let maps: GACMap[] = [
  { id: "652ba0d9002aa0d36f996153", name: "An Official World", available: true, bestScore: 0 },
  { id: "62a44b22040f04bd36e8a914", name: "A Community World", available: false, bestScore: 0, timer: 400 },
  { id: "60aaef355f79500001032f71", name: "Intersectionguessr - France", available: true, bestScore: 0, gamemode: GACGamemode.Pan | GACGamemode.Zoom },
]
export let globalGamemode: GACGamemode = GACGamemode.None
export let globalTimerSeconds: number = 120

// Render pop-up
setNotConnected()
document.querySelector("#connect-form")!.addEventListener("submit", sendConnectionOptions)
await renderMaps()
