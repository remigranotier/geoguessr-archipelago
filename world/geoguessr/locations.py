from __future__ import annotations

from typing import TYPE_CHECKING

from BaseClasses import ItemClassification, Location

from . import items

if TYPE_CHECKING:
    from .world import GeoguessrWorld

# Every location must have a unique integer ID associated with it, so this means we need to generate unique IDs for each location.
# Each region will have its range of IDs and we will shift them by 5 for every country to account for the 5 associated types
CHECK_TYPES = [
    "Bronze Medal",
    "Silver Medal",
    "Gold Medal",
    "Platinum Medal",
    "First 5k",
]

REGION_BASE_IDS = {
    "world": 1,
    "europe": 100,
    "asia": 200,
    "africa": 300,
    "north_america": 400,
    "south_america": 500,
    "oceania": 600,
}

EUROPE_COUNTRY_NAMES = [
    "Monaco",
    "France",
]
ASIA_COUNTRY_NAMES = []
AFRICA_COUNTRY_NAMES = []
NORTH_AMERICA_COUNTRY_NAMES = []
SOUTH_AMERICA_COUNTRY_NAMES = []
OCEANIA_COUNTRY_NAMES = []

location_name_to_id = {
    "World Bronze Medal": 1,
    "World Silver Medal": 2,
    "World Gold Medal": 3,
    "World Platinum Medal": 4,
    "World First 5k": 5,
}

class GeoguessrLocation(Location):
    game = "Geoguessr"

def get_location_names_with_ids(location_names: list[str]) -> dict[str, int | None]:
    return {location_name: location_name_to_id[location_name] for location_name in location_names}

def create_all_locations(world: GeoguessrWorld) -> None:
    fill_location_name_to_id()
    create_regular_locations(world)
    create_events(world)

def fill_location_name_to_id() -> None:
    add_locations("europe", EUROPE_COUNTRY_NAMES)
    add_locations("asia", ASIA_COUNTRY_NAMES)
    add_locations("africa", AFRICA_COUNTRY_NAMES)
    add_locations("north_america", NORTH_AMERICA_COUNTRY_NAMES)
    add_locations("south_america", SOUTH_AMERICA_COUNTRY_NAMES)
    add_locations("oceania", OCEANIA_COUNTRY_NAMES)

def add_locations(region_name: str, country_names: list[str]) -> None:
    base_id = REGION_BASE_IDS[region_name]

    for country_index, country_name in enumerate(country_names):
        for check_index, check_type in enumerate(CHECK_TYPES):
            loc_name = f"{country_name} {check_type}"
            loc_id = base_id + country_index * len(CHECK_TYPES) + check_index
            location_name_to_id[loc_name] = loc_id

def create_regular_locations(world: GeoguessrWorld) -> None:
    world_region = world.get_region("World")
    europe_region = world.get_region("Europe")
    asia_region = world.get_region("Asia")
    africa_region = world.get_region("Africa")
    north_america_region = world.get_region("North America")
    south_america_region = world.get_region("South America")
    oceania_region = world.get_region("Oceania")

    world_locations = get_location_names_with_ids(
        [loc_name for loc_name, loc_id in location_name_to_id.items() if loc_id < REGION_BASE_IDS["europe"]]
    )

    europe_locations = get_location_names_with_ids(
        [loc_name for loc_name, loc_id in location_name_to_id.items() if loc_id >= REGION_BASE_IDS["europe"] and loc_id < REGION_BASE_IDS["asia"]]
    )

    asia_locations = get_location_names_with_ids(
        [loc_name for loc_name, loc_id in location_name_to_id.items() if loc_id >= REGION_BASE_IDS["asia"] and loc_id < REGION_BASE_IDS["africa"]]
    )

    africa_locations = get_location_names_with_ids(
        [loc_name for loc_name, loc_id in location_name_to_id.items() if loc_id >= REGION_BASE_IDS["africa"] and loc_id < REGION_BASE_IDS["north_america"]]
    )

    north_america_locations = get_location_names_with_ids(
        [loc_name for loc_name, loc_id in location_name_to_id.items() if loc_id >= REGION_BASE_IDS["north_america"] and loc_id < REGION_BASE_IDS["south_america"]]
    )

    south_america_locations = get_location_names_with_ids(
        [loc_name for loc_name, loc_id in location_name_to_id.items() if loc_id >= REGION_BASE_IDS["south_america"] and loc_id < REGION_BASE_IDS["oceania"]]
    )

    oceania_locations = get_location_names_with_ids(
        [loc_name for loc_name, loc_id in location_name_to_id.items() if loc_id >= REGION_BASE_IDS["oceania"]]
    )

    world_region.add_locations(world_locations, GeoguessrLocation)
    europe_region.add_locations(europe_locations, GeoguessrLocation)
    asia_region.add_locations(asia_locations, GeoguessrLocation)
    africa_region.add_locations(africa_locations, GeoguessrLocation)
    north_america_region.add_locations(north_america_locations, GeoguessrLocation)
    south_america_region.add_locations(south_america_locations, GeoguessrLocation)
    oceania_region.add_locations(oceania_locations, GeoguessrLocation)


def create_events(world: GeoguessrWorld) -> None:
    pass  # No events to create at this time