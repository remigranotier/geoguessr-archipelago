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
    const scale = CountriesThresholdsScales[areaName] ?? 1
    return {
        [GACMedal.None]: defaultMedalThresholds[GACMedal.None],
        [GACMedal.Bronze]: defaultMedalThresholds[GACMedal.Bronze] * scale,
        [GACMedal.Silver]: defaultMedalThresholds[GACMedal.Silver] * scale,
        [GACMedal.Gold]: defaultMedalThresholds[GACMedal.Gold],
        [GACMedal.Platinum]: defaultMedalThresholds[GACMedal.Platinum],
    }
}