import type { GACMedal } from "./medals";
import type { Continent, Country, World } from "./countries";
import { getScaledThresholds } from "./medals";

export const LOCATIONS_PER_MAP = 5 // Bronze, Silver, Gold, Platinum, 5k
export const ITEMS_PER_MAP = 4 // Unlock, Pan, Move, Zoom
export const NUMBER_OF_ROUNDS = 5
export const PERFECT_SCORE = 5000

export enum AreaLocations {
    Bronze = 0,
    Silver = 1,
    Gold = 2,
    Platinum = 3,
    FiveK = 4,
}

export enum AreaItems {
    Unlock = 0,
    Pan = 1,
    Move = 2,
    Zoom = 3
}

export type Area =
    | World
    | Continent
    | Country;

export class AreaMap {
    area: Area
    areaName: string
    baseLocationId: number
    baseItemId: number
    mapId: string
    mapName: string
    medalThresholds: Record<GACMedal, number>

    constructor(area: Area, areaName: string, mapId: string, mapName: string) {
        this.area = area
        this.areaName = areaName
        this.baseLocationId = this.getBaseLocationId(this.area)
        this.baseItemId = this.getBaseItemId(this.area)
        this.mapId = mapId
        this.mapName = mapName
        this.medalThresholds = getScaledThresholds(areaName)
    }

    getBaseLocationId(area: Area): number {
        switch (area.kind) {
            case "world":
                return 1;

            case "continent":
                return 1000 * area.continentNumber;

            case "country":
                return 1000 * area.continentNumber + LOCATIONS_PER_MAP * area.countryNumber;
        }
    }

    getBaseItemId(area: Area): number {
        switch (area.kind) {
            case "world":
                return 1;

            case "continent":
                return 1000 * area.continentNumber;

            case "country":
                return 1000 * area.continentNumber + ITEMS_PER_MAP * area.countryNumber;
        }
    }
}