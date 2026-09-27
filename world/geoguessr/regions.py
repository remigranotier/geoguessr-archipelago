from __future__ import annotations

from typing import TYPE_CHECKING

from BaseClasses import Entrance, Region

if TYPE_CHECKING:
    from .world import GeoguessrWorld


def create_and_connect_regions(world: GeoguessrWorld) -> None:
    create_all_regions(world)
    connect_regions(world)


def create_all_regions(world: GeoguessrWorld) -> None:
    world_region = Region("World", world.player, world.multiworld)
    europe_region = Region("Europe", world.player, world.multiworld)
    asia_region = Region("Asia", world.player, world.multiworld)
    africa_region = Region("Africa", world.player, world.multiworld)
    north_america_region = Region("North America", world.player, world.multiworld)
    south_america_region = Region("South America", world.player, world.multiworld)
    oceania_region = Region("Oceania", world.player, world.multiworld)

    regions = [
        world_region,
        europe_region,
        asia_region,
        africa_region,
        north_america_region,
        south_america_region,
        oceania_region,
    ]
    world.multiworld.regions += regions


def connect_regions(world: GeoguessrWorld) -> None:
    world_region = world.get_region("World")
    europe_region = world.get_region("Europe")
    asia_region = world.get_region("Asia")
    africa_region = world.get_region("Africa")
    north_america_region = world.get_region("North America")
    south_america_region = world.get_region("South America")
    oceania_region = world.get_region("Oceania")

    world_region.connect(
        europe_region,
        "World to Europe",
        lambda state: state.has("Europe", world.player),
    )
    world_region.connect(
        asia_region, "World to Asia", lambda state: state.has("Asia", world.player)
    )
    world_region.connect(
        africa_region,
        "World to Africa",
        lambda state: state.has("Africa", world.player),
    )
    world_region.connect(
        north_america_region,
        "World to North America",
        lambda state: state.has("North America", world.player),
    )
    world_region.connect(
        south_america_region,
        "World to South America",
        lambda state: state.has("South America", world.player),
    )
    world_region.connect(
        oceania_region,
        "World to Oceania",
        lambda state: state.has("Oceania", world.player),
    )
