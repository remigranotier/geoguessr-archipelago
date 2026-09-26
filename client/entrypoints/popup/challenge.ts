import { GACGamemode } from '../common/models.ts'

export async function generateChallenge(mapId: string, timeLimit: number, gamemode: GACGamemode): Promise<string> {
    const response = await fetch(
        "https://www.geoguessr.com/api/v3/challenges",
        {
            method: "POST",
            body: JSON.stringify({
                map: mapId,
                timeLimit: timeLimit,
                forbidMoving: !(gamemode & GACGamemode.Move),
                forbidZooming: !(gamemode & GACGamemode.Zoom),
                forbidRotating: !(gamemode & GACGamemode.Pan),
                accessLevel: 1,
                challengeType: 0,
                roundCount: 5,
                guessMapType: "roadmap"
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }
    )

    const responseJson = await response.json()
    const challengeId = responseJson["token"]

    return challengeId
}