import { GACGamemode } from "./models"
import { AreaLocations, LOCATIONS_PER_MAP, LocationsNames, CONTINENT_ID_OFFSET } from "./config/area-map"
import { mapsConfig } from "./config/maps"

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

export function getLocationName(id: number) {
    const locName = LocationsNames[(id % CONTINENT_ID_OFFSET) % LOCATIONS_PER_MAP as AreaLocations]

    const continentId = Math.floor(id / CONTINENT_ID_OFFSET)
    const countryId = Math.floor((id % CONTINENT_ID_OFFSET) / LOCATIONS_PER_MAP)
    const baseLocationId = CONTINENT_ID_OFFSET * continentId + LOCATIONS_PER_MAP * countryId

    const mapName = mapsConfig.get(baseLocationId)?.areaName!

    const fullName = mapName + " " + locName

    return fullName
}