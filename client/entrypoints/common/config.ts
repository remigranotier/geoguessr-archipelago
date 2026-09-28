import { GACMedal } from "./models";

const LOCATIONS_PER_MAP = 6 // Bronze, Silver, Gold, Platinum, 5k, MapComplete
export const ITEMS_PER_MAP = 4 // Unlock, Pan, Move, Zoom

export enum AreaLocations {
    Bronze = 1,
    Silver = 2,
    Gold = 3,
    Platinum = 4,
    FiveK = 5,
    MapComplete = 6,
}

export enum AreaItems {
    Unlock = 0,
    Pan = 1,
    Move = 2,
    Zoom = 3
}

export const medalThresholds: Record<GACMedal, number> = {
    [GACMedal.None]: 0,
    [GACMedal.Bronze]: 7500,
    [GACMedal.Silver]: 15000,
    [GACMedal.Gold]: 22500,
    [GACMedal.Platinum]: 25000,
}

export enum WorldNumber {
    World = 1
}

export enum ContinentNumber {
    Europe = 1
}

export type World = {
    kind: "world";
    worldNumber: WorldNumber;
};

export type Continent = {
    kind: "continent";
    continentNumber: ContinentNumber;
};

export type Country<C extends ContinentNumber = ContinentNumber> = {
    kind: "country";
    continentNumber: C;
    countryNumber: number;
}

export type Area =
    | World
    | Continent
    | Country;

export class AreaMap {
    area: Area
    baseLocationId: number
    baseItemId: number
    mapId: string
    mapName: string

    constructor(area: Area, mapId: string, mapName: string) {
        this.area = area
        this.baseLocationId = this.getBaseLocationId(this.area)
        this.baseItemId = this.getBaseItemId(this.area)
        this.mapId = mapId
        this.mapName = mapName
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
                return 0;

            case "continent":
                return 1000 * area.continentNumber;

            case "country":
                return 1000 * area.continentNumber + ITEMS_PER_MAP * area.countryNumber;
        }
    }
}

let allMaps: AreaMap[] = []

// World Maps
allMaps.push(new AreaMap({ kind: "world", worldNumber: WorldNumber.World }, "652ba0d9002aa0d36f996153", "An Official World"))

// Continent Maps
allMaps.push(new AreaMap({ kind: "continent", continentNumber: ContinentNumber.Europe }, "6614fdc6c867062cb1a0a2f4", "Intersectionguessr - Europe"))

// Country Maps
allMaps.push(new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: 1 }, "60aaef355f79500001032f71", "Intersectionguessr - France"))

export const mapsConfig: AreaMap[] = allMaps
