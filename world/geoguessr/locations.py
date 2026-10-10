from __future__ import annotations

from collections import defaultdict
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
    region_location_ids = defaultdict(list)

    for country in world.drawn_countries:
        if country.region not in region_location_ids:
            region_location_ids[country.region] += [loc_name for loc_name, loc_id in location_name_to_id.items() if loc_name.startswith(f"{country.region.value} -")]
        region_location_ids[country.region] += [loc_name for loc_name, loc_id in location_name_to_id.items() if loc_name.startswith(f"{country.name} -")]
    

    world_region = world.get_region(common.WORLD_REGION)
    world_locations = get_location_names_with_ids([loc_name for loc_name, loc_id in location_name_to_id.items() if loc_name.startswith(f"{common.WORLD_REGION} -")])
    print("World locations:", world_locations)
    world_region.add_locations(world_locations, GeoguessrLocation)

    for region, location_ids in region_location_ids.items():
        ap_region = world.get_region(region.value)
        region_locations = get_location_names_with_ids(location_ids)
        print(f"region locations for {region.value}:", region_locations)
        ap_region.add_locations(region_locations, GeoguessrLocation)


def generate_locations() -> dict[str:int]:
    # Generate World locations
    for check_index, check_type in enumerate(common.LOCATION_TYPES):
        loc_name = f"{common.WORLD_REGION} - {check_type}"
        loc_id = common.REGION_BASE_IDS[common.WORLD_REGION] + check_index
        location_name_to_id[loc_name] = loc_id
    
    # Generate country + region locations
    region_country_names = {}
    for country in common.COUNTRIES.values():
        if country.region not in region_country_names:
            for check_index, check_type in enumerate(common.LOCATION_TYPES):
                loc_name = f"{country.region.value} - {check_type}"
                loc_id = common.REGION_BASE_IDS[country.region] + check_index
                location_name_to_id[loc_name] = loc_id
            region_country_names[country.region] = []
        for check_index, check_type in enumerate(common.LOCATION_TYPES):
            loc_name = f"{country.name} - {check_type}"
            loc_id = (
                common.REGION_BASE_IDS[country.region] + (len(region_country_names[country.region]) + 1) * len(common.LOCATION_TYPES) + check_index
            )
            location_name_to_id[loc_name] = loc_id
        region_country_names[country.region].append(country.name)

    return location_name_to_id


def create_events(world: GeoguessrWorld) -> None:
    world_region_name = common.WORLD_REGION
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
            region.add_event(
                f"{map_name} - {check_type} Event",
                f"{map_name} - {check_type} Obtained Event Item",
                location_type=GeoguessrLocation,
                item_type=items.GeoguessrItem,
            )
