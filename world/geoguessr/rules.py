from __future__ import annotations

from typing import TYPE_CHECKING

from rule_builder.options import OptionFilter
from rule_builder.rules import Has, HasAll, Rule

from .options import HardMode

if TYPE_CHECKING:
    from .world import GeoguessrWorld

def set_all_rules(world: GeoguessrWorld) -> None:
    set_all_entrance_rules(world)
    set_all_location_rules(world)
    set_completion_condition(world)

def set_all_entrance_rules(world: GeoguessrWorld) -> None:
    #These are already set in regions.py, but if we want to add more specific rules later, they should be here.
    pass

def set_all_location_rules(world: GeoguessrWorld) -> None:

    for region_name in ["Europe", "Asia", "Africa", "North America", "South America", "Oceania"]:
        region = world.get_region(region_name)

        for location in region.locations:
            country_name = location.name.rsplit(" ", 2)[0]

            pan_item = f"Pan ({country_name})"
            move_item = f"Move ({country_name})"

            if "Silver" in location.name:
                world.set_rule(
                    location,
                    lambda state, move_item=move_item, pan_item=pan_item: state.has(pan_item, world.player) | state.has(move_item, world.player)
                )
            elif "Gold" in location.name:
                world.set_rule(
                    location,
                    lambda state, move_item=move_item, pan_item=pan_item: state.has(move_item, world.player) & state.has(pan_item, world.player)
                )
            elif "Platinum" in location.name:
                world.set_rule(
                    location,
                    lambda state, move_item=move_item, pan_item=pan_item: state.has(move_item, world.player) & state.has(pan_item, world.player)
                )
            elif "5k" in location.name:
                world.set_rule(
                    location,
                    lambda state, move_item=move_item, pan_item=pan_item:state.has(move_item, world.player) & state.has(pan_item, world.player)
                )

def set_completion_condition(world: GeoguessrWorld) -> None:
    # This means that the Victory event has to be triggered from the client side.
    # It is the client's responsibility to determine when.
    world.set_completion_rule(Has("Victory"))