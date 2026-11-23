import { CountriesThresholdsScales } from "./thresholds"
import { AreaLocations } from "@/entrypoints/common/config/area-map"
import bronzeMedal from '~/assets/medal_bronze.svg'
import silverMedal from '~/assets/medal_silver.svg'
import goldMedal from '~/assets/medal_gold.svg'
import platinumMedal from '~/assets/medal_platinum.svg'

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

export function getScaledThresholds(areaNameKey: string): Record<GACMedal, number> {
    const scale = CountriesThresholdsScales[areaNameKey] ?? 1
    return {
        [GACMedal.None]: defaultMedalThresholds[GACMedal.None],
        [GACMedal.Bronze]: defaultMedalThresholds[GACMedal.Bronze] * scale,
        [GACMedal.Silver]: defaultMedalThresholds[GACMedal.Silver] * scale,
        [GACMedal.Gold]: defaultMedalThresholds[GACMedal.Gold],
        [GACMedal.Platinum]: defaultMedalThresholds[GACMedal.Platinum],
    }
}

export function getAreaLocationIcon(location: AreaLocations, height: number = 25) {
    if (location == AreaLocations.FiveK) {
        const fivekSpan = document.createElement("span")
        fivekSpan.textContent = "[5K]"
        fivekSpan.style.fontWeight = "bold"
        return fivekSpan
    }

    const medalIcon = document.createElement("img")
    switch (location) {
        case AreaLocations.Bronze:
            medalIcon.src = bronzeMedal
            break
        case AreaLocations.Silver:
            medalIcon.src = silverMedal
            break
        case AreaLocations.Gold:
            medalIcon.src = goldMedal
            break
        case AreaLocations.Platinum:
            medalIcon.src = platinumMedal
            break
    }
    medalIcon.height = height
    return medalIcon
}


export function getMedalIcon(medal: GACMedal, height: number = 25) {
    if (medal == GACMedal.None) {
        const noneSpan = document.createElement("span")
        noneSpan.textContent = "❌"
        return noneSpan
    }

    const medalIcon = document.createElement("img")
    switch (medal) {
        case GACMedal.Bronze:
            medalIcon.src = bronzeMedal
            break
        case GACMedal.Silver:
            medalIcon.src = silverMedal
            break
        case GACMedal.Gold:
            medalIcon.src = goldMedal
            break
        case GACMedal.Platinum:
            medalIcon.src = platinumMedal
            break
    }
    medalIcon.height = height
    return medalIcon
}