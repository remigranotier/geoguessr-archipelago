from __future__ import annotations

from typing import TYPE_CHECKING

from rule_builder.rules import Has, True_, HasAllCounts

from . import common

if TYPE_CHECKING:
    from .world import GeoguessrWorld


def set_all_rules(world: GeoguessrWorld) -> None:
    set_all_entrance_rules(world)
    set_all_location_rules(world)
    set_completion_condition(world)


def set_all_entrance_rules(world: GeoguessrWorld) -> None:
    # These are already set in regions.py, but if we want to add more specific rules later, they should be here.
    pass


def set_all_location_rules(world: GeoguessrWorld) -> None:

    for region_name in common.REGION_NAMES:
        region = world.get_region(region_name)

        for location in region.locations:
            # Careful cause that won't work for countries with several words
            country_name = location.name.rsplit(" ", 2)[0]

            loc_rule = Has(country_name)

            pan_item = f"Pan ({country_name})"
            move_item = f"Move ({country_name})"
            zoom_item = f"Zoom ({country_name})"

            has_pan = Has(pan_item)
            has_move = Has(move_item)
            has_zoom = Has(zoom_item)
            has_pan_or_move = has_pan | has_move
            has_pan_and_move = has_pan & has_move
            has_all_modes = has_pan & has_move & has_zoom

            if "Silver" in location.name:
                loc_rule &= has_pan_or_move
            elif "Gold" in location.name or "5k" in location.name:
                loc_rule &= has_pan_and_move
            elif "Platinum" in location.name or "Map Complete" in location.name:
                loc_rule &= has_all_modes

            world.set_rule(location, loc_rule)


def set_completion_condition(world: GeoguessrWorld) -> None:
    world.set_completion_rule(
        HasAllCounts({"Platinum medal": world.options.plat_count.value})
    )
