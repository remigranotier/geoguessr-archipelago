from __future__ import annotations

from typing import TYPE_CHECKING

from BaseClasses import Location

from . import common, items

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
        region_countries = [country for country in world.drawn_countries if country.region == region]
        if region != common.REGION.World and len(region_countries) == 0:
            continue

        ap_region = world.get_region(region.value)

        location_ids = []
        location_ids += [loc_name for loc_name, loc_id in location_name_to_id.items() if loc_name.startswith(f"{region.name} -")]
        for country in region_countries:
            location_ids += [loc_name for loc_name, loc_id in location_name_to_id.items() if loc_name.startswith(f"{country.name} -")]

        region_locations = get_location_names_with_ids(location_ids)

        print("region locations:", region_locations)
        ap_region.add_locations(region_locations, GeoguessrLocation)


def generate_locations() -> dict[str:int]:
    for region in common.REGION:
        # skipping regions that don't have countries
        region_country_names = [country.name for country in common.COUNTRIES.values() if country.region == region]
        if region != common.REGION.World and len(region_country_names) == 0:
            continue

        generate_region_locations(region, region_country_names)

    return location_name_to_id


def generate_region_locations(region: common.REGION, country_names: list[str]) -> None:
    base_id = common.REGION_BASE_IDS[region]

    for check_index, check_type in enumerate(common.LOCATION_TYPES):
        loc_name = f"{region.value} - {check_type}"
        loc_id = base_id + check_index
        print(f"Adding {loc_id} - {loc_name}")
        location_name_to_id[loc_name] = loc_id

    for country_index, country_name in enumerate(country_names):
        for check_index, check_type in enumerate(common.LOCATION_TYPES):
            loc_name = f"{country_name} - {check_type}"
            loc_id = (
                base_id + (country_index + 1) * len(common.LOCATION_TYPES) + check_index
            )
            print(f"Adding {loc_id} - {loc_name}")
            location_name_to_id[loc_name] = loc_id


def create_events(world: GeoguessrWorld) -> None:
    world_region_name = common.REGION.World.value
    world_region = world.get_region(world_region_name)
    add_map_events(world_region_name, world_region)

    for region in common.REGION:
        region_country_names = [country.name for country in world.drawn_countries if country.region == region]
        if len(region_country_names) == 0:
            continue

        it_region = world.get_region(region.value)
        add_map_events(region.value, it_region)

        for country in region_country_names:
            add_map_events(country, it_region)


def add_map_events(map_name, region):
    region.add_event(
        f"{map_name} - Platinum Event",
        f"{map_name} - Platinum Obtained Event Item",
        location_type=GeoguessrLocation,
        item_type=items.GeoguessrItem,
    )

    for check_type in common.LOCATION_TYPES:
        if "Medal" in check_type:
            print(f"event {map_name} {check_type} in region {region.name}")
            region.add_event(
                f"{map_name} - {check_type} Event",
                f"{map_name} - {check_type} Obtained Event Item",
                location_type=GeoguessrLocation,
                item_type=items.GeoguessrItem,
            )
