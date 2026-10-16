from dataclasses import dataclass

from Options import Choice, OptionError, PerGameCommonOptions, Range, Toggle

from . import common


def get_map_amount() -> int:
    return 1 + len(common.REGION) + len(common.COUNTRIES)


class VictoryCondition(Choice):
    """
    The condition that must be met to win the run.
    """

    display_name = "Victory Condition"

    # Reach a certain amount of medals in the game, chosen with another option
    option_medals_count = 0

    # Reach a set amount of platinum medals, chosen with another option
    option_plat_count = 1

    # Choice options must define an explicit default value.
    default = option_plat_count


class MedalCount(Range):
    """
    The number of medals the player must collect to win the run.
    """

    display_name = "Medal Count"

    range_start = 1
    range_end = get_map_amount() * 4
    default = get_map_amount() * 3


class PlatCount(Range):
    """
    The number of platinum medals the player must collect to win the run.
    """

    display_name = "Platinum Medal Count"

    range_start = 1
    range_end = get_map_amount()
    default = 5


class AccessibleCountriesCount(Range):
    """
    The number of randomly drawn country maps the player can unlock, on all continents combined.
    """

    display_name = "Number of accessible countries"

    range_start = 1
    range_end = len(common.COUNTRIES)
    default = 10


class MaxMicroCountriesCount(Range):
    """
    The maximum number of randomly drawn countries that can be micro-countries or countries with minimal coverage.
    This option does not force the number of micro-countries, only limits them if they happen to be drawn too much.
    """

    display_name = "Max number of micro-states or countries with minimal coverage"

    range_start = 0
    range_end = len(
        [
            country
            for country in common.COUNTRIES.values()
            if country.difficulty == common.Difficulty.MicroCountry
        ]
    )
    default = 3


class CountriesDifficultyLevel(Choice):
    """
    A setting determining the maximum difficulty a drawn country can have
    """

    display_name = "Countries max difficulty level"

    option_easy = 0
    option_medium = 1
    option_hard = 2

    default = option_hard


class IncludesPlatinums(Toggle):
    """
    A setting to allow the player to remove platinum medals locations
    """

    default = 1


@dataclass
class GeoguessrOptions(PerGameCommonOptions):
    victory_condition: VictoryCondition
    medal_count: MedalCount
    plat_count: PlatCount
    accessible_countries_count: AccessibleCountriesCount
    max_micro_countries_count: MaxMicroCountriesCount
    countries_max_difficulty: CountriesDifficultyLevel
    include_platinums: IncludesPlatinums


def check_options(world):

    if (
        not world.options.include_platinums.value
        and world.options.victory_condition.value == 1
    ):
        raise OptionError(
            "Options specify platinum count as victory condition but also removes platinum medals from locations"
        )

    amount_of_possible_countries = (
        len(
            [
                country
                for country in common.COUNTRIES.values()
                if country.difficulty.value
                <= world.options.countries_max_difficulty.value + 1
                and country.difficulty.value > common.Difficulty.MicroCountry
            ]
        )
        + world.options.max_micro_countries_count
    )

    if amount_of_possible_countries < world.options.accessible_countries_count.value:
        raise OptionError(
            f"Difficulty and micro country count options too restrictive for accessible country count value ({amount_of_possible_countries} < {world.options.accessible_countries_count.value})"
        )

    number_of_drawn_countries = world.options.accessible_countries_count.value

    if number_of_drawn_countries < len(common.REGION):
        max_map_amount = number_of_drawn_countries * 2 + 1
    else:
        max_map_amount = number_of_drawn_countries + len(common.REGION) + 1

    match world.options.victory_condition:
        case 0:  # Medals count
            medal_amount = (
                len(
                    [
                        location
                        for location in common.LOCATION_TYPES
                        if "Medal" in location
                        and (
                            world.options.include_platinums.value
                            or "Platinum" not in location
                        )
                    ]
                )
            ) * max_map_amount

            if world.options.medal_count > medal_amount:
                raise OptionError(
                    f"Medal count objective is too high for number of maps playable in game (max {max_map_amount})"
                )
        case 1:  # Platinum count
            if world.options.plat_count > max_map_amount:
                raise OptionError(
                    f"Platinum count objective is too high for number of maps playable in game (max {max_map_amount})"
                )
