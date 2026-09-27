from collections.abc import Mapping
from typing import Any

from worlds.AutoWorld import World

from . import locations, regions, rules
from . import options as geoguessr_options
from . import items
from . import web_world  # rename due to a name conflict with World.options


class GeoguessrWorld(World):
    game = "Geoguessr"

    web = web_world.GeoguessrWebWorld()

    options_dataclass = geoguessr_options.GeoguessrOptions
    options: geoguessr_options.GeoguessrOptions

    location_name_to_id = locations.location_name_to_id
    item_name_to_id = items.ITEM_NAME_TO_ID

    origin_region_name = "World"

    def create_regions(self) -> None:
        regions.create_and_connect_regions(self)
        locations.create_all_locations(self)

    def set_rules(self) -> None:
        rules.set_all_rules(self)

    def create_items(self) -> None:
        items.create_all_items(self)

    def create_item(self, name: str) -> items.GeoguessrItem:
        return items.create_item_with_correct_classification(self, name)

    def get_filler_item_name(self) -> str:
        return items.get_random_filler_item_name(self)

    def fill_slot_data(self) -> Mapping[str, Any]:
        return self.options.as_dict("victory_condition", "medal_count", "plat_count")

    def fill_hook(self, progitempool, usefulitempool, filleritempool, fill_locations):
        for loc in self.get_locations():
            if "Map Complete" in loc.name:
                self.multiworld.get_location(loc.name, self.player).place_locked_item(
                    next(
                        item
                        for item in self.multiworld.get_items()
                        if item.name == "Platinum medal"
                    )
                )
