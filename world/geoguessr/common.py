from enum import Enum


class REGION(Enum):
    World = "World"
    Europe = "Europe"
    Asia = "Asia"
    Africa = "Africa"
    North_America = "North America"
    South_America = "South America"
    Oceania = "Oceania"


# Used to offset IDs based on their region
REGION_BASE_IDS = {
    REGION.World: 1,
    REGION.Europe: 1000,
    REGION.Asia: 2000,
    REGION.Africa: 3000,
    REGION.North_America: 4000,
    REGION.South_America: 5000,
    REGION.Oceania: 6000,
}

EUROPE_COUNTRY_NAMES = ["France"]

ASIA_COUNTRY_NAMES = []
AFRICA_COUNTRY_NAMES = []
NORTH_AMERICA_COUNTRY_NAMES = []
SOUTH_AMERICA_COUNTRY_NAMES = []
OCEANIA_COUNTRY_NAMES = []

LOCATION_TYPES = [
    "Bronze Medal",
    "Silver Medal",
    "Gold Medal",
    "Platinum Medal",
    "First 5k",
]

ITEM_TYPES = ["Unlock", "Pan", "Move", "Zoom"]

ALL_COUNTRIES_PER_REGION = {
    REGION.World: [],
    REGION.Europe: EUROPE_COUNTRY_NAMES,
    REGION.Asia: ASIA_COUNTRY_NAMES,
    REGION.Africa: AFRICA_COUNTRY_NAMES,
    REGION.North_America: NORTH_AMERICA_COUNTRY_NAMES,
    REGION.South_America: SOUTH_AMERICA_COUNTRY_NAMES,
    REGION.Oceania: OCEANIA_COUNTRY_NAMES,
}
