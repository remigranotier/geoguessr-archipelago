import { GACMedal } from "./models";

const LOCATIONS_PER_MAP = 5 // Bronze, Silver, Gold, Platinum, 5k
export const ITEMS_PER_MAP = 4 // Unlock, Pan, Move, Zoom

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
    Europe = 1,
    North_America = 4,
    South_America = 5
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
    areaName: string
    baseLocationId: number
    baseItemId: number
    mapId: string
    mapName: string

    constructor(area: Area, areaName: string, mapId: string, mapName: string) {
        this.area = area
        this.areaName = areaName
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
                return 1;

            case "continent":
                return 1000 * area.continentNumber;

            case "country":
                return 1000 * area.continentNumber + ITEMS_PER_MAP * area.countryNumber;
        }
    }
}

let allMaps: AreaMap[] = []

// World Maps
allMaps.push(new AreaMap({ kind: "world", worldNumber: WorldNumber.World }, "World", "652ba0d9002aa0d36f996153", "An Official World"))

// Continent Maps
allMaps.push(new AreaMap({ kind: "continent", continentNumber: ContinentNumber.Europe }, "Europe", "6614fdc6c867062cb1a0a2f4", "Intersectionguessr - Europe"))
allMaps.push(new AreaMap({ kind: "continent", continentNumber: ContinentNumber.North_America }, "North America", "69367baba92b1c6d29fda74f", "Intersectionguessr - North America"))
allMaps.push(new AreaMap({ kind: "continent", continentNumber: ContinentNumber.South_America }, "South America", "69369c4ea92b1c6d29fe244a", "Intersectionguessr - South America"))

// Country Maps
allMaps.push(new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: 1 }, "Spain", "6616578eab257b1970742ebb", "Intersectionguessr - France"))
allMaps.push(new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: 2 }, "Switzerland", "66167ce9a81e8da8b719a373", "Intersectionguessr - France"))
allMaps.push(new AreaMap({ kind: "country", continentNumber: ContinentNumber.North_America, countryNumber: 1 }, "USA", "66153e71ee6a46d2f47df5d9", "Coupe de la Ligue - United States of America"))
allMaps.push(new AreaMap({ kind: "country", continentNumber: ContinentNumber.North_America, countryNumber: 2 }, "Bermuda", "661539303e6152c402a83848", "Coupe de la Ligue - Bermuda"))
allMaps.push(new AreaMap({ kind: "country", continentNumber: ContinentNumber.South_America, countryNumber: 1 }, "Chile", "661544e1fe45e9b41eecf738", "Intersectionguessr - France"))

export const mapsConfig: AreaMap[] = allMaps
