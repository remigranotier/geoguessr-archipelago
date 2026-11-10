import { GACGamemode } from "./models"
import {
    ContinentNumber,
    EuropeCountryNumber,
    AfricaCountryNumber,
    AsiaCountryNumber,
    NorthAmericaCountryNumber,
    SouthAmericaCountryNumber,
    OceaniaCountryNumber
} from "./config/countries"
import { AreaLocations, LOCATIONS_PER_MAP, LocationsNames, CONTINENT_ID_OFFSET } from "./config/area-map"

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
    let mapName = ""
    let fullName = ""
    const locName = LocationsNames[(id % CONTINENT_ID_OFFSET) % LOCATIONS_PER_MAP as AreaLocations]

    const continentId = Math.floor(id / CONTINENT_ID_OFFSET)
    const countryId = Math.floor((id % CONTINENT_ID_OFFSET) / LOCATIONS_PER_MAP)

    // World map location
    if (continentId == 0) {
        mapName = "World"
    } else if (countryId == 0) {
        mapName = ContinentNumber[continentId]!
    } else {
        switch(continentId as ContinentNumber) {
            case ContinentNumber.Europe:
                mapName = EuropeCountryNumber[countryId]!
                break
            case ContinentNumber.Asia:
                mapName = AsiaCountryNumber[countryId]!
                break
            case ContinentNumber.Africa:
                mapName = AfricaCountryNumber[countryId]!
                break
            case ContinentNumber.North_America:
                mapName = NorthAmericaCountryNumber[countryId]!
                break
            case ContinentNumber.South_America:
                mapName = SouthAmericaCountryNumber[countryId]!
                break
            case ContinentNumber.Oceania:
                mapName = OceaniaCountryNumber[countryId]!
                break
            default:
                console.log(`Given location id has a continent id that does not exist (${continentId})`)
        }
    }

    mapName = mapName.replaceAll("_", " ")

    fullName = mapName + " " + locName

    return fullName
}