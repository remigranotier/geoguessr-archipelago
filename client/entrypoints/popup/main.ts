import './style.css';
import { generateChallenge } from './challenge.ts';

import { Gamemode, Map } from '../common/models.ts'

let maps: Map[] = [
  { id: "652ba0d9002aa0d36f996153", name: "An Official World", available: true, bestScore: 0 },
  { id: "62a44b22040f04bd36e8a914", name: "A Community World", available: false, bestScore: 0, timer: 400 },
  { id: "60aaef355f79500001032f71", name: "Intersectionguessr - France", available: true, bestScore: 0, gamemode: Gamemode.Pan | Gamemode.Zoom },
]

let globalGamemode: Gamemode = Gamemode.None
let globalTimerSeconds: number = 120

async function renderMaps() {
  const mapTable = document.getElementById('map-table');
  const tbody = mapTable?.querySelector('tbody');

  for (var map of maps) {
    const row = await renderMap(map)
    tbody?.appendChild(row)
  }
}

async function renderMap(map: Map): Promise<HTMLTableRowElement> {
  const row = document.createElement("tr");
  const mapNameCell: HTMLTableCellElement = document.createElement("td")
  const gamemodeCell: HTMLTableCellElement = document.createElement("td")
  const timerCell: HTMLTableCellElement = document.createElement("td")
  const bestScoreCell: HTMLTableCellElement = document.createElement("td")
  const availableCell: HTMLTableCellElement = document.createElement("td")

  const currentGamemode: Gamemode = map.gamemode ?? globalGamemode;
  const currentTimer: number = map.timer ?? globalTimerSeconds;

  mapNameCell.textContent = map.name;
  if (map.available) {
    mapNameCell.classList.add("activeLink")
    mapNameCell.onclick = async (_: PointerEvent) => {
      const challengeId = await generateChallenge(map.id, currentTimer, currentGamemode)
      browser.tabs.create({
        url: `https://www.geoguessr.com/challenge/${challengeId}`
      })
    }
  } else {
    mapNameCell.classList.add("inactiveLink")
  }


  gamemodeCell.textContent = `${currentGamemode & Gamemode.Move ? "" : "No "}Move, ${currentGamemode & Gamemode.Pan ? "" : "No "}Pan, ${currentGamemode & Gamemode.Zoom ? "" : "No "}Zoom`

  if (currentTimer == 0) {
    timerCell.textContent = "No Time"
  } else {
    const minutes = Math.floor(currentTimer / 60)
    const seconds = currentTimer % 60
    timerCell.textContent = `${minutes > 0 ? minutes + "min" : ""}${seconds > 0 ? seconds + "s" : ""}`
  }

  bestScoreCell.textContent = map.bestScore.toString()

  availableCell.textContent = map.available ? "yes" : "no"

  row.appendChild(mapNameCell)
  row.appendChild(gamemodeCell)
  row.appendChild(timerCell)
  row.appendChild(bestScoreCell)
  row.appendChild(availableCell)

  return row
}

renderMaps()
