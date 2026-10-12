import { GACMedal } from "../models";

export const medalThresholds: Record<GACMedal, number> = {
    [GACMedal.None]: 0,
    [GACMedal.Bronze]: 7500,
    [GACMedal.Silver]: 15000,
    [GACMedal.Gold]: 22500,
    [GACMedal.Platinum]: 25000,
}