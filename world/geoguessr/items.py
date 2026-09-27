from __future__ import annotations

from typing import TYPE_CHECKING

from BaseClasses import Item, ItemClassification

if TYPE_CHECKING:
    from .world import GeoguessrWorld

ITEM_NAME_TO_ID = {
    "Europe": 1,
    "Asia": 2,
    "Africa": 3,
    "North America": 4,
    "South America": 5,
    "Oceania": 6,
    "Monaco": 7,
    "France": 8,
    "Move (Monaco)": 9,
    "Pan (Monaco)": 10,
    "Zoom (Monaco)": 11,
    "Move (France)": 12,
    "Pan (France)": 13,
    "Zoom (France)": 14,
    "Special tip !": 1000,
}

DEFAULT_ITEM_CLASSIFICATIONS = {
    "Europe": ItemClassification.progression,
    "Asia": ItemClassification.progression,
    "Africa": ItemClassification.progression,
    "North America": ItemClassification.progression,
    "South America": ItemClassification.progression,
    "Oceania": ItemClassification.progression,
    "Monaco": ItemClassification.progression,
    "France": ItemClassification.progression,
    "Move (Monaco)": ItemClassification.progression,
    "Pan (Monaco)": ItemClassification.progression,
    "Zoom (Monaco)": ItemClassification.useful,
    "Move (France)": ItemClassification.progression,
    "Pan (France)": ItemClassification.progression,
    "Zoom (France)": ItemClassification.useful,
    "Special tip !": ItemClassification.filler,
}


class GeoguessrItem(Item):
    game = "Geoguessr"


# This function might return a trap item too !
def get_random_filler_item_name(world: GeoguessrWorld) -> str:
    return "Special tip !"


def create_item_with_correct_classification(
    world: GeoguessrWorld, name: str
) -> GeoguessrItem:
    return GeoguessrItem(
        name, DEFAULT_ITEM_CLASSIFICATIONS[name], ITEM_NAME_TO_ID[name], world.player
    )


def create_all_items(world: GeoguessrWorld) -> None:
    itempool: list[Item] = [
        world.create_item("Europe"),
        world.create_item("Asia"),
        world.create_item("Africa"),
        world.create_item("North America"),
        world.create_item("South America"),
        world.create_item("Oceania"),
        world.create_item("Monaco"),
        world.create_item("France"),
        world.create_item("Move (Monaco)"),
        world.create_item("Pan (Monaco)"),
        world.create_item("Zoom (Monaco)"),
        world.create_item("Move (France)"),
        world.create_item("Pan (France)"),
        world.create_item("Zoom (France)"),
    ]

    number_of_unfilled_locations = len(
        world.multiworld.get_unfilled_locations(world.player)
    )
    needed_number_of_filler_items = number_of_unfilled_locations - len(itempool)
    itempool += [world.create_filler() for _ in range(needed_number_of_filler_items)]
    world.multiworld.itempool += itempool
