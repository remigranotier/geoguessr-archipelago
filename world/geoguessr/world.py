import random
from collections.abc import Mapping
from typing import Any

from worlds.AutoWorld import World

from . import (
    common,
    items,
    locations,
    regions,
    rules,
    web_world,  # rename due to a name conflict with World.options
)
from . import options as geoguessr_options


class GeoguessrWorld(World):
    game = "Geoguessr"

    web = web_world.GeoguessrWebWorld()


    location_name_to_id = locations.generate_locations()
    item_name_to_id = items.generate_ids()

    origin_region_name = common.REGION.World.value

    options_dataclass = geoguessr_options.GeoguessrOptions
    options: geoguessr_options.GeoguessrOptions

    def draw_countries(self):
        # TODO: filter countries based on presets/difficulty etc
        all_countries = [country for country in common.COUNTRIES.values()]
        random.shuffle(all_countries)
        drawn_countries = set()
        micro_countries_drawn = 0
        while len(drawn_countries) < self.options.accessible_countries_count.value and len(all_countries) > 0:
            new_country = all_countries.pop()
            if new_country.is_micro:
                if micro_countries_drawn >= self.options.max_micro_countries_count:
                    continue
                micro_countries_drawn += 1
            drawn_countries.add(new_country)

        if len(all_countries) == 0 and len(drawn_countries) < self.options.accessible_countries_count.value:
            raise RuntimeError("Not enough countries available to be added with these parameters")

        print(f"Drawn countries are: {[country.name for country in drawn_countries]}")
        self.drawn_countries = drawn_countries

    def create_regions(self) -> None:
        self.draw_countries()
        regions.create_and_connect_regions(self)
        locations.create_all_locations(self)

    def set_rules(self) -> None:
        rules.set_all_rules(self)

    def create_items(self) -> None:
        items.create_all_items(self)
        self.item_name_to_id = items.item_name_to_id

    def create_item(self, name: str) -> items.GeoguessrItem:
        return items.create_item_with_correct_classification(self, name)

    def get_filler_item_name(self) -> str:
        return items.get_random_filler_item_name(self)

    def fill_slot_data(self) -> Mapping[str, Any]:
        return self.options.as_dict("victory_condition", "medal_count", "plat_count", "accessible_countries_count", "max_micro_countries_count")
