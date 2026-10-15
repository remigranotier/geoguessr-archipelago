import math
from collections.abc import Mapping
from typing import Any

from Options import OptionError
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

    origin_region_name = common.WORLD_REGION

    options_dataclass = geoguessr_options.GeoguessrOptions
    options: geoguessr_options.GeoguessrOptions

    def check_options(self):

        number_of_drawn_countries = self.options.accessible_countries_count.value
        max_map_amount = number_of_drawn_countries + len(common.REGION) + 1

        if number_of_drawn_countries < len(common.REGION):
            max_map_amount = number_of_drawn_countries * 2 + 1

        match self.options.victory_condition:
            case 0:  # Medals count
                if self.options.medal_count > (
                    len(
                        [
                            location
                            for location in common.LOCATION_TYPES
                            if "Medal" in location.value
                        ]
                    )
                    * max_map_amount
                ):
                    raise OptionError(
                        f"Medal count objective is too high for number of maps playable in game (max {max_map_amount})"
                    )
            case 1:  # Platinum count
                if self.options.plat_count > max_map_amount:
                    raise OptionError(
                        f"Platinum count objective is too high for number of maps playable in game (max {max_map_amount})"
                    )

    def draw_countries(self):
        all_countries = list(common.COUNTRIES.values())
        self.random.shuffle(all_countries)
        drawn_countries = set()
        micro_countries_drawn = 0
        drawn_regions = []

        necessary_region_amount = 1

        match self.options.victory_condition.value:
            case 0:  # medal count
                min_accessible_medals = (
                    self.options.accessible_countries_count.value * 4 + 8
                )
                if self.options.medal_count.value > min_accessible_medals:
                    necessary_region_amount = math.ceil(
                        (self.options.medal_count.value - min_accessible_medals) / 4
                    )

            case 1:  # plat count
                min_accessible_plat = self.options.accessible_countries_count.value + 2
                if self.options.plat_count.value > min_accessible_plat:
                    necessary_region_amount = (
                        self.options.plat_count.value - min_accessible_plat + 1
                    )

        while (
            len(drawn_countries) < self.options.accessible_countries_count.value
            and len(all_countries) > 0
        ):
            new_country = all_countries.pop()

            # Check for micro country count limit
            if new_country.difficulty == common.Difficulty.MicroCountry:
                if micro_countries_drawn >= self.options.max_micro_countries_count:
                    continue
                micro_countries_drawn += 1

            # Check for difficulty level limit
            if (
                new_country.difficulty.value
                > self.options.countries_max_difficulty.value
            ):
                continue

            # check if the amount of drawn regions allows for the medal/platinum goal to be reached
            if new_country.region not in drawn_regions:
                drawn_regions.append(new_country.region)
                necessary_region_amount -= 1
            elif (
                necessary_region_amount > 0
                and (
                    self.options.accessible_countries_count.value - len(drawn_countries)
                )
                == necessary_region_amount
            ):
                continue

            drawn_countries.add(new_country)

        if (
            len(all_countries) == 0
            and len(drawn_countries) < self.options.accessible_countries_count.value
        ):
            raise OptionError(
                f"max_micro_countries_count is too low for option accessible_countries_count={self.options.accessible_countries_count} (not enough countries)"
            )

        print(f"Drawn countries are: {[country.name for country in drawn_countries]}")
        self.drawn_countries = drawn_countries

    def generate_early(self) -> None:
        self.check_options()
        self.draw_countries()

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
        return self.options.as_dict(
            "victory_condition",
            "medal_count",
            "plat_count",
            "accessible_countries_count",
            "max_micro_countries_count",
        )
