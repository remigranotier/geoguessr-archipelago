from __future__ import annotations

from typing import TYPE_CHECKING, Any

from BaseClasses import Item, ItemClassification

from . import common

if TYPE_CHECKING:
    from .world import GeoguessrWorld

SPECIAL_TIP_NAME = "Special tip!"
QUESTIONABLE_TIP_NAME = "Questionable tip!"

item_name_to_id = {
    SPECIAL_TIP_NAME: 10000,
    QUESTIONABLE_TIP_NAME: 10001,
}

default_item_classifications = {
    SPECIAL_TIP_NAME: ItemClassification.filler,
    QUESTIONABLE_TIP_NAME: ItemClassification.filler,
}


class GeoguessrItem(Item):
    game = "Geoguessr"


def get_random_filler_item_name(world: GeoguessrWorld) -> str:
    random = world.random.randint(0, 1)
    if random == 0:
        return SPECIAL_TIP_NAME
    else:
        return QUESTIONABLE_TIP_NAME


def create_item_with_correct_classification(
    world: GeoguessrWorld, name: str
) -> GeoguessrItem:
    return GeoguessrItem(
        name, default_item_classifications[name], item_name_to_id[name], world.player
    )


def create_all_items(world: GeoguessrWorld) -> None:
    itempool = []

    for region in common.REGION:
        # skipping regions that don't have countries
        if (
            len(common.ALL_COUNTRIES_PER_REGION[region]) == 0
            and region.value != "World"
        ):
            continue

        itempool += add_map_items(world, region.value)

        for country in common.ALL_COUNTRIES_PER_REGION[region]:
            itempool += add_map_items(
                world,
                country,
            )

    base_world_map = world.create_item("World")
    world.push_precollected(base_world_map)

    number_of_unfilled_locations = len(
        world.multiworld.get_unfilled_locations(world.player)
    )
    needed_number_of_filler_items = number_of_unfilled_locations - len(itempool)
    itempool += [world.create_filler() for _ in range(needed_number_of_filler_items)]
    world.multiworld.itempool += itempool


def add_map_items(world, map_name) -> list[Any]:
    new_items = []
    pan_item_name = f"Pan ({map_name})"
    move_item_name = f"Move ({map_name})"
    zoom_item_name = f"Zoom ({map_name})"

    default_item_classifications[map_name] = ItemClassification.progression
    default_item_classifications[pan_item_name] = ItemClassification.progression
    default_item_classifications[move_item_name] = ItemClassification.progression
    default_item_classifications[zoom_item_name] = ItemClassification.progression

    if map_name != "World":
        new_items.append(world.create_item(map_name))
    new_items.append(world.create_item(pan_item_name))
    new_items.append(world.create_item(move_item_name))
    new_items.append(world.create_item(zoom_item_name))
    return new_items


def generate_ids() -> dict[str:int]:
    for region in common.REGION:
        # skipping regions that don't have countries
        if (
            len(common.ALL_COUNTRIES_PER_REGION[region]) == 0
            and region.value != "World"
        ):
            continue

        create_map_ids(region.value, common.REGION_BASE_IDS[region])

        for index, country in enumerate(common.ALL_COUNTRIES_PER_REGION[region]):
            create_map_ids(
                country,
                common.REGION_BASE_IDS[region] + (index + 1) * len(common.ITEM_TYPES),
            )

    return item_name_to_id


def create_map_ids(map_name, offset):
    pan_item_name = f"Pan ({map_name})"
    move_item_name = f"Move ({map_name})"
    zoom_item_name = f"Zoom ({map_name})"

    item_name_to_id[map_name] = offset
    item_name_to_id[pan_item_name] = offset + 1
    item_name_to_id[move_item_name] = offset + 2
    item_name_to_id[zoom_item_name] = offset + 3
