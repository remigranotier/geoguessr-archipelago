import { GACGamemode } from "./models"

export function gamemodeFromData(data: any) {
    let gamemode = GACGamemode.None
    if (!data["forbidMoving"]) {
        gamemode |= GACGamemode.Move
    }
    if (!data["forbidZooming"]) {
        gamemode |= GACGamemode.Zoom
    }
    if (!data["forbidRotating"]) {
        gamemode |= GACGamemode.Pan
    }
    return gamemode
}

export function isPlatinumMedalEnabled(configData: Record<string, unknown>) {
    return configData.include_platinums && !configData.no_move_mode
}