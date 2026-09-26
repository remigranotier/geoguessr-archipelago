import type { GameFinishedMessage } from "../common/models";

export async function handleGameFinishedMessage(message: GameFinishedMessage) {
    console.log(`Player got ${message.score} pts on map ${message.mapName}`)
}