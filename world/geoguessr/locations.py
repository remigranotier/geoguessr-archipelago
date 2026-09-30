from __future__ import annotations

from typing import TYPE_CHECKING

from BaseClasses import Location

from . import common

if TYPE_CHECKING:
    from .world import GeoguessrWorld

location_name_to_id = {}


class GeoguessrLocation(Location):
    game = "Geoguessr"


def get_location_names_with_ids(location_names: list[str]) -> dict[str, int | None]:
    return {
        location_name: location_name_to_id[location_name]
        for location_name in location_names
    }


def create_all_locations(world: GeoguessrWorld) -> None:
    create_regular_locations(world)
    create_events(world)


def create_regular_locations(world: GeoguessrWorld) -> None:

    for region in common.REGION:
        # skipping regions that don't have countries
        if (
            len(common.ALL_COUNTRIES_PER_REGION[region]) == 0
            and region.value != "World"
        ):
            continue

        ap_region = world.get_region(region.value)

        region_locations = get_location_names_with_ids(
            [
                loc_name
                for loc_name, loc_id in location_name_to_id.items()
                if loc_id >= common.REGION_BASE_IDS[region]
                and loc_id < common.REGION_BASE_IDS[region] + 1000
            ]
        )
        ap_region.add_locations(region_locations, GeoguessrLocation)


def generate_locations() -> dict[str:int]:

    for region in common.REGION:
        # skipping regions that don't have countries
        if (
            len(common.ALL_COUNTRIES_PER_REGION[region]) == 0
            and region.value != "World"
        ):
            continue

        generate_region_locations(region, common.ALL_COUNTRIES_PER_REGION[region])

    return location_name_to_id


def generate_region_locations(region: common.REGION, country_names: list[str]) -> None:
    base_id = common.REGION_BASE_IDS[region]

    for check_index, check_type in enumerate(common.LOCATION_TYPES):
        loc_name = f"{region.value} {check_type}"
        loc_id = base_id + check_index
        location_name_to_id[loc_name] = loc_id

    for country_index, country_name in enumerate(country_names):
        for check_index, check_type in enumerate(common.LOCATION_TYPES):
            loc_name = f"{country_name} {check_type}"
            loc_id = (
                base_id + (country_index + 1) * len(common.LOCATION_TYPES) + check_index
            )
            location_name_to_id[loc_name] = loc_id


def create_events(world: GeoguessrWorld) -> None:

    pass
