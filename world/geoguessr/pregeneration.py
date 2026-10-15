import math

from . import (
    common,
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
            > self.options.countries_max_difficulty.value + 1
        ):
            continue

        # check if the amount of drawn regions allows for the medal/platinum goal to be reached
        if new_country.region not in drawn_regions:
            drawn_regions.append(new_country.region)
            necessary_region_amount -= 1
        elif (
            necessary_region_amount > 0
            and (self.options.accessible_countries_count.value - len(drawn_countries))
            == necessary_region_amount
        ):
            continue

        drawn_countries.add(new_country)

    print(f"Drawn countries are: {[country.name for country in drawn_countries]}")
    self.drawn_countries = drawn_countries
