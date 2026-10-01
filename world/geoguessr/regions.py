from __future__ import annotations

from typing import TYPE_CHECKING

from BaseClasses import Region
from . import common

if TYPE_CHECKING:
    from .world import GeoguessrWorld


def create_and_connect_regions(world: GeoguessrWorld) -> None:
    create_all_regions(world)
    connect_regions(world)


def create_all_regions(world: GeoguessrWorld) -> None:
    regions = []

    for region in common.REGION:
        # skipping regions that don't have countries
        if (
            len(common.ALL_COUNTRIES_PER_REGION[region]) == 0
            and region.value != "World"
        ):
            continue

        regions.append(Region(region.value, world.player, world.multiworld))

    world.multiworld.regions += regions


def connect_regions(world: GeoguessrWorld) -> None:
    world_region = world.get_region("World")

    for region in common.REGION:
        if region.value == "World" or len(common.ALL_COUNTRIES_PER_REGION[region]) == 0:
            continue

        region_to_connect = world.get_region(region.value)

        world_region.connect(
            region_to_connect,
            f"World to {region.value}",
            lambda state, region_name=region.value: state.has(
                region_name, world.player
            ),
        )
