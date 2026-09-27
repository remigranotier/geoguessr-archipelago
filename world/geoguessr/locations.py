from __future__ import annotations

from typing import TYPE_CHECKING

from BaseClasses import Location

from . import common

if TYPE_CHECKING:
    from .world import GeoguessrWorld

location_name_to_id = {
    "World Bronze Medal": 2,
    "World Silver Medal": 3,
    "World Gold Medal": 4,
    "World Platinum Medal": 5,
    "World First 5k": 6,
}


class GeoguessrLocation(Location):
    game = "Geoguessr"


def get_location_names_with_ids(location_names: list[str]) -> dict[str, int | None]:
    return {
        location_name: location_name_to_id[location_name]
        for location_name in location_names
    }


def create_all_locations(world: GeoguessrWorld) -> None:
    fill_location_name_to_id()
    create_regular_locations(world)
    create_events(world)


def fill_location_name_to_id() -> None:

    # Add the locations for each region
    add_locations("Europe", common.EUROPE_COUNTRY_NAMES)
    # add_locations("asia", ASIA_COUNTRY_NAMES)
    # add_locations("africa", AFRICA_COUNTRY_NAMES)
    # add_locations("north_america", NORTH_AMERICA_COUNTRY_NAMES)
    # add_locations("south_america", SOUTH_AMERICA_COUNTRY_NAMES)
    # add_locations("oceania", OCEANIA_COUNTRY_NAMES)


def add_locations(region_name: str, country_names: list[str]) -> None:
    base_id = common.REGION_BASE_IDS[region_name]

    for check_index, check_type in enumerate(common.LOCATION_TYPES):
        loc_name = f"{region_name} {check_type}"
        loc_id = base_id + check_index
        location_name_to_id[loc_name] = loc_id

    for country_index, country_name in enumerate(country_names):
        for check_index, check_type in enumerate(common.LOCATION_TYPES):
            loc_name = f"{country_name} {check_type}"
            loc_id = (
                base_id + (country_index + 1) * len(common.LOCATION_TYPES) + check_index
            )
            location_name_to_id[loc_name] = loc_id


def create_regular_locations(world: GeoguessrWorld) -> None:
    world_region = world.get_region("World")
    europe_region = world.get_region("Europe")
    # asia_region = world.get_region("Asia")
    # africa_region = world.get_region("Africa")
    # north_america_region = world.get_region("North America")
    # south_america_region = world.get_region("South America")
    # oceania_region = world.get_region("Oceania")

    world_locations = get_location_names_with_ids(
        [
            loc_name
            for loc_name, loc_id in location_name_to_id.items()
            if loc_id < common.REGION_BASE_IDS["Europe"]
        ]
    )

    europe_locations = get_location_names_with_ids(
        [
            loc_name
            for loc_name, loc_id in location_name_to_id.items()
            if loc_id >= common.REGION_BASE_IDS["Europe"]
            and loc_id < common.REGION_BASE_IDS["Asia"]
        ]
    )

    # asia_locations = get_location_names_with_ids(
    #     [
    #         loc_name
    #         for loc_name, loc_id in location_name_to_id.items()
    #         if loc_id >= REGION_BASE_IDS["Asia"] and loc_id < REGION_BASE_IDS["Africa"]
    #     ]
    # )

    # africa_locations = get_location_names_with_ids(
    #     [
    #         loc_name
    #         for loc_name, loc_id in location_name_to_id.items()
    #         if loc_id >= REGION_BASE_IDS["Africa"]
    #         and loc_id < REGION_BASE_IDS["North America"]
    #     ]
    # )

    # north_america_locations = get_location_names_with_ids(
    #     [
    #         loc_name
    #         for loc_name, loc_id in location_name_to_id.items()
    #         if loc_id >= REGION_BASE_IDS["North America"]
    #         and loc_id < REGION_BASE_IDS["South America"]
    #     ]
    # )

    # south_america_locations = get_location_names_with_ids(
    #     [
    #         loc_name
    #         for loc_name, loc_id in location_name_to_id.items()
    #         if loc_id >= REGION_BASE_IDS["South America"]
    #         and loc_id < REGION_BASE_IDS["Oceania"]
    #     ]
    # )

    # oceania_locations = get_location_names_with_ids(
    #     [
    #         loc_name
    #         for loc_name, loc_id in location_name_to_id.items()
    #         if loc_id >= REGION_BASE_IDS["Oceania"]
    #     ]
    # )

    world_region.add_locations(world_locations, GeoguessrLocation)
    europe_region.add_locations(europe_locations, GeoguessrLocation)
    # asia_region.add_locations(asia_locations, GeoguessrLocation)
    # africa_region.add_locations(africa_locations, GeoguessrLocation)
    # north_america_region.add_locations(north_america_locations, GeoguessrLocation)
    # south_america_region.add_locations(south_america_locations, GeoguessrLocation)
    # oceania_region.add_locations(oceania_locations, GeoguessrLocation)


def create_events(world: GeoguessrWorld) -> None:
    # world_region = world.get_region("World")
    # world_region.add_event(
    #     "Win condition reached",
    #     "Victory",
    #     location_type=GeoguessrLocation,
    #     item_type=items.GeoguessrItem,
    # )
    pass
