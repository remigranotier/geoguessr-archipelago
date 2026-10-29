import { CountriesThresholdsScales } from "./thresholds"

export enum GACMedal {
    None = 0,
    Bronze = 1,
    Silver = 2,
    Gold = 3,
    Platinum = 4
}

export function getScaledThresholds(areaName: string): Record<GACMedal, number> {
    const custom_scale = globalThis.gameState.configData.custom_scaling as number;
    const scale = (CountriesThresholdsScales[areaName] ?? 1) * custom_scale
    return {
        [GACMedal.None]: 0,
        [GACMedal.Bronze]: Math.round((7500 * scale) / 500) * 500,
        [GACMedal.Silver]: Math.round((15000 * scale) / 500) * 500,
        [GACMedal.Gold]: Math.round((22500 * custom_scale)/500) * 500,
        [GACMedal.Platinum]: 25000,
    }
}