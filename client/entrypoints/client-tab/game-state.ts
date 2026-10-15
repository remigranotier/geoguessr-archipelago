import { GACGameState } from "../common/models";

export async function getGameState() {
    const maybeGameState = await storage.getItem<GACGameState>(`local:${globalThis.connectionStatus.seed}-${globalThis.connectionStatus.player}`)
    if (maybeGameState === null) {
        console.error(`Could not get game state with key local:${globalThis.connectionStatus.seed}-${globalThis.connectionStatus.player}`)
        return new GACGameState([])
    }
    return maybeGameState
}