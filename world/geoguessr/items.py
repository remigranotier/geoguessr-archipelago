from __future__ import annotations

from typing import TYPE_CHECKING

from BaseClasses import Item, ItemClassification

if TYPE_CHECKING:
    from .world import GeoguessrWorld

ITEM_NAME_TO_ID = {
    "Europe": 1,
    "Pan (Europe)": 2,
    "Move (Europe)": 3,
    "Zoom (Europe)": 4,
    # "Asia": 2,
    # "Africa": 3,
    # "North America": 4,
    # "South America": 5,
    # "Oceania": 6,
    # "Monaco": 7,
    "France": 8,
    # "Spain": 9,
    # "Iceland": 10,
    "Move (World)": 11,
    "Pan (World)": 12,
    "Zoom (World)": 13,
    # "Move (Monaco)": 14,
    # "Pan (Monaco)": 15,
    # "Zoom (Monaco)": 16,
    "Move (France)": 17,
    "Pan (France)": 18,
    "Zoom (France)": 19,
    # "Move (Spain)": 20,
    # "Pan (Spain)": 21,
    # "Zoom (Spain)": 22,
    # "Move (Iceland)": 23,
    # "Pan (Iceland)": 24,
    # "Zoom (Iceland)": 25,
    "Special tip !": 1000,
    "Platinum medal": 1001,
}

DEFAULT_ITEM_CLASSIFICATIONS = {
    "Europe": ItemClassification.progression,
    "Pan (Europe)": ItemClassification.progression,
    "Move (Europe)": ItemClassification.progression,
    "Zoom (Europe)": ItemClassification.useful,
    # "Asia": ItemClassification.progression,
    # "Africa": ItemClassification.progression,
    # "North America": ItemClassification.progression,
    # "South America": ItemClassification.progression,
    # "Oceania": ItemClassification.progression,
    # "Monaco": ItemClassification.progression,
    "France": ItemClassification.progression,
    # "Spain": ItemClassification.progression,
    # "Iceland": ItemClassification.progression,
    "Move (World)": ItemClassification.progression,
    "Pan (World)": ItemClassification.progression,
    "Zoom (World)": ItemClassification.useful,
    # "Move (Monaco)": ItemClassification.progression,
    # "Pan (Monaco)": ItemClassification.progression,
    # "Zoom (Monaco)": ItemClassification.useful,
    "Move (France)": ItemClassification.progression,
    "Pan (France)": ItemClassification.progression,
    "Zoom (France)": ItemClassification.useful,
    # "Move (Spain)": ItemClassification.progression,
    # "Pan (Spain)": ItemClassification.progression,
    # "Zoom (Spain)": ItemClassification.useful,
    # "Move (Iceland)": ItemClassification.progression,
    # "Pan (Iceland)": ItemClassification.progression,
    # "Zoom (Iceland)": ItemClassification.useful,
    "Special tip !": ItemClassification.filler,
    "Platinum medal": ItemClassification.progression,
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
    # TODO : loop this
    itempool: list[Item] = [
        world.create_item("Europe"),
        world.create_item("Pan (Europe)"),
        world.create_item("Move (Europe)"),
        world.create_item("Zoom (Europe)"),
        # world.create_item("Asia"),
        # world.create_item("Africa"),
        # world.create_item("North America"),
        # world.create_item("South America"),
        # world.create_item("Oceania"),
        # world.create_item("Monaco"),
        world.create_item("France"),
        # world.create_item("Spain"),
        # world.create_item("Iceland"),
        world.create_item("Move (World)"),
        world.create_item("Pan (World)"),
        world.create_item("Zoom (World)"),
        # world.create_item("Move (Monaco)"),
        # world.create_item("Pan (Monaco)"),
        # world.create_item("Zoom (Monaco)"),
        world.create_item("Move (France)"),
        world.create_item("Pan (France)"),
        world.create_item("Zoom (France)"),
        # world.create_item("Move (Spain)"),
        # world.create_item("Pan (Spain)"),
        # world.create_item("Zoom (Spain)"),
        # world.create_item("Move (Iceland)"),
        # world.create_item("Pan (Iceland)"),
        # world.create_item("Zoom (Iceland)"),
    ]

    for loc in world.get_locations():
        if "Map Complete" in loc.name:
            new_plat_medal = GeoguessrItem(
                "Platinum medal",
                ItemClassification.progression,
                ITEM_NAME_TO_ID["Platinum medal"],
                world.player,
            )
            world.multiworld.get_location(loc.name, world.player).place_locked_item(
                new_plat_medal
            )

    number_of_unfilled_locations = len(
        world.multiworld.get_unfilled_locations(world.player)
    )
    needed_number_of_filler_items = number_of_unfilled_locations - len(itempool)
    itempool += [world.create_filler() for _ in range(needed_number_of_filler_items)]
    world.multiworld.itempool += itempool
