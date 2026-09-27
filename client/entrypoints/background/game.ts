import { GACGamemode, GACGameState, GACMap, GenerateGameMessage, GeoguessrGameStatus, RetrieveGameStateMessage, RoundFinishedMessage } from '../common/models.ts'
import { globalGamemode, globalTimerSeconds, maps } from './index.ts'

export async function generateGame(mapId: string, timeLimit: number, gamemode: GACGamemode): Promise<string> {
    const response = await fetch(
        "https://www.geoguessr.com/api/v3/games",
        {
            method: "POST",
            body: JSON.stringify({
                map: mapId,
                timeLimit: timeLimit,
                forbidMoving: !(gamemode & GACGamemode.Move),
                forbidZooming: !(gamemode & GACGamemode.Zoom),
                forbidRotating: !(gamemode & GACGamemode.Pan),
                type: "standard"
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }
    )

    const responseJson = await response.json()
    const gameId = responseJson["token"]
    return gameId
}

export async function handleGenerateGameMessage(message: GenerateGameMessage) {
    const map = maps.find((m: GACMap) => m.id === message.mapId)
    if (map === undefined) {
        throw new Error(`No map with id ${message.mapId} found`)
    }

    const gameId = await generateGame(map.id, map.timer ?? globalTimerSeconds, map.gamemode ?? globalGamemode)
    const newTab = await browser.tabs.create({
        url: `https://www.geoguessr.com/game/${gameId}`
    })
}

export async function handleGameFinishedMessage(message: RoundFinishedMessage) {
    if (message.roundScore == 5000) {
        console.log(`Player got a 5k on map ${message.mapName}`)
    }

    if (message.gameStatus == GeoguessrGameStatus.FINISHED) {
        console.log(`Player got ${message.totalScore} pts on map ${message.mapName}`)
    }
}

export function getCurrentGameState() {
    const gameState = new GACGameState(maps, globalGamemode, globalTimerSeconds)
    return gameState
}