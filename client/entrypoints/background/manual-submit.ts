import { RoundFinishedMessage, type SubmitManualIdMessage } from "../common/messages";
import { GACGameType, GeoguessrGameStatus } from "../common/models";
import { gamemodeFromData } from "../common/utils";
import { handleRoundFinishedMessage } from "./game";

export async function handleSubmitManualId(message: SubmitManualIdMessage) {
    const idRegex = new RegExp('^[a-zA-Z0-9]{16}$')
    if (!idRegex.test(message.id)) {
        throw new Error(`Input error: ID received has invalid format`)
    }

    console.debug(`Trying to fetch game results with id ${message.id}`)

    const gamesResponse = await fetch(
        `https://www.geoguessr.com/api/v3/games/${message.id}`
    )

    if (gamesResponse.ok) {
        const data = await gamesResponse.json()
        const totalScoreInPoints = data["player"]["totalScoreInPoints"]
        const guesses: any[] = data["player"]["guesses"]
        const isFiveK = guesses.some((guess) => (guess["roundScoreInPoints"] as number) == 5000)
        const roundFinishedMessage = new RoundFinishedMessage(
            GeoguessrGameStatus.FINISHED, 
            message.id, 
            GACGameType.Game, 
            gamemodeFromData(data), 
            data["map"], 
            data["mapName"], 
            isFiveK ? 5000 : 0, 
            totalScoreInPoints
        )
        handleRoundFinishedMessage(roundFinishedMessage)
        return
    }

    console.debug(`Trying to fetch challenge results with id ${message.id}`)

    const challengesResponse = await fetch(
        `https://www.geoguessr.com/api/v3/results/highscores/${message.id}`
    )

    if (challengesResponse.ok) {
        const data = await challengesResponse.json()
        const game = data["items"][0]["game"]
        console.debug("GAME", game)
        const totalScoreInPoints = game["player"]["totalScoreInPoints"]
        const guesses: any[] = game["player"]["guesses"]
        const isFiveK = guesses.some((guess) => (guess["roundScoreInPoints"] as number) == 5000)
        const roundFinishedMessage = new RoundFinishedMessage(
            GeoguessrGameStatus.FINISHED, 
            message.id, 
            GACGameType.Challenge, 
            gamemodeFromData(game), 
            game["map"], 
            game["mapName"], 
            isFiveK ? 5000 : 0, 
            totalScoreInPoints
        )
        handleRoundFinishedMessage(roundFinishedMessage)
        return
    }

    throw new Error("Unknown ID for challenge or game")
}