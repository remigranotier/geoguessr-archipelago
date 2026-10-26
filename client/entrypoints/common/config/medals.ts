import { CountriesThresholdsScales } from "./thresholds"

export enum GACMedal {
    None = 0,
    Bronze = 1,
    Silver = 2,
    Gold = 3,
    Platinum = 4
}

export const defaultMedalThresholds: Record<GACMedal, number> = {
    [GACMedal.None]: 0,
    [GACMedal.Bronze]: 7500,
    [GACMedal.Silver]: 15000,
    [GACMedal.Gold]: 22500,
    [GACMedal.Platinum]: 25000,
}

export function getScaledThresholds(areaName: string): Record<GACMedal, number> {
    const scale = CountriesThresholdsScales[areaName]
    return {
        [GACMedal.None]: 0,
        [GACMedal.Bronze]: 7500 * (scale ?? 1),
        [GACMedal.Silver]: 15000 * (scale ?? 1),
        [GACMedal.Gold]: 22500,
        [GACMedal.Platinum]: 25000,
    }
}