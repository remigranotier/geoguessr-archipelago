import { GeoguessrGameStatus, type RoundFinishedMessage } from "../common/models";

export async function handleGameFinishedMessage(message: RoundFinishedMessage) {
    if (message.roundScore == 5000) {
        console.log(`Player got a 5k on map ${message.mapName}`)
    }

    if (message.gameStatus == GeoguessrGameStatus.FINISHED) {
        console.log(`Player got ${message.totalScore} pts on map ${message.mapName}`)
    }
}