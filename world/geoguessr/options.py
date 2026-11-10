from dataclasses import dataclass

from Options import Choice, OptionError, PerGameCommonOptions, Range, Toggle

from . import common


def get_map_amount() -> int:
    return 1 + len(common.REGION) + len(common.COUNTRIES)


class VictoryCondition(Choice):
    """
    The condition that must be met to win the run. Available medals are: Bronze, Silver, Gold, Platinum (if enabled).

    Medals count: obtain a certain amount of medals (all types included)
    Platinum count: obtain a certain amount of Platinum medals (perfect score)
    """

    display_name = "Victory Condition"

    # Reach a certain amount of medals in the game, chosen with another option
    option_medals_count = 0

    # Reach a set amount of platinum medals, chosen with another option
    option_plat_count = 1

    # Choice options must define an explicit default value.
    default = option_medals_count


class MedalCount(Range):
    """
    The number of medals the player must collect to win the run.
    """

    display_name = "Medal Count"

    range_start = 1
    range_end = get_map_amount() * 4
    default = 20


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

    There are 22 micro countries in the game, so be careful if you set the micro country limit to a lower value than 22:
    you will not be able to put the maximum amount of countries possible in this case.

    We advise you NOT to put many more accessible countries than necessary to reach the goal: doing so would lower the
    percentage of locations to collect to reach the goal.
    """

    display_name = "Number of accessible countries"

    range_start = 1
    range_end = len(common.COUNTRIES)
    default = 5


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
    default = 1


class CountriesDifficultyLevel(Choice):
    """
    A setting determining the maximum difficulty a drawn country can have.

    This can restrict generation if the number of accessible countries parametered is too high to fill the game with enough countries of an acceptable difficulty.
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

    display_name = "Include platinum medals"

    default = 1


class CustomScaling(Range):
    """
    A custom scaling percentage to be applied to thresholds. It will be applied to Bronze, Silver and Gold medal thresholds.
    Default thresholds are Explorer mode values (Bronze 7500, Silver 15000, Gold 22500) but some countries are balanced to have a doable score.
    This custom scaling is applied after that original balancing.
    """

    display_name = "Threshold scaling percentage for Bronze, Silver and Gold medals"

    range_start = 50
    range_end = 100
    default = 100


class DeathLinkEnabled(Toggle):
    """
    A setting to enable DeathLink: whenever a DeathLink-tagged game sends a death to the server,
    having this enabled will send an Antarctica guess on all opened games of Geoguessr.

    There are no conditions that send deaths from Geoguessr, for now.
    """

    display_name = "Enable DeathLink"

    default = 0


@dataclass
class GeoguessrOptions(PerGameCommonOptions):
    victory_condition: VictoryCondition
    medal_count: MedalCount
    plat_count: PlatCount
    accessible_countries_count: AccessibleCountriesCount
    max_micro_countries_count: MaxMicroCountriesCount
    countries_max_difficulty: CountriesDifficultyLevel
    include_platinums: IncludesPlatinums
    custom_scaling_percentage: CustomScaling
    deathlink_enabled: DeathLinkEnabled


option_presets = {
    "Beginner": {
        "victory_condition": VictoryCondition.option_medals_count,
        "medal_count": 15,
        "accessible_countries_count": 5,
        "max_micro_countries_count": 2,
        "countries_max_difficulty": CountriesDifficultyLevel.option_easy,
        "include_platinums": False,
        "custom_scaling_percentage": 75,
        "deathlink_enabled": 0,
    },
    "Pinpointer": {
        "victory_condition": VictoryCondition.option_plat_count,
        "plat_count": 5,
        "accessible_countries_count": 5,
        "max_micro_countries_count": 1,
        "countries_max_difficulty": CountriesDifficultyLevel.option_medium,
        "include_platinums": True,
        "custom_scaling_percentage": 100,
        "deathlink_enabled": 0,
    },
    "NM Player": {
        "victory_condition": VictoryCondition.option_medals_count,
        "medal_count": 30,
        "accessible_countries_count": 10,
        "max_micro_countries_count": 2,
        "countries_max_difficulty": CountriesDifficultyLevel.option_medium,
        "include_platinums": False,
        "custom_scaling_percentage": 100,
        "deathlink_enabled": 0,
    },
    "I'm Blinky": {
        "victory_condition": VictoryCondition.option_plat_count,
        "medal_count": 10,
        "accessible_countries_count": 10,
        "max_micro_countries_count": 1,
        "countries_max_difficulty": CountriesDifficultyLevel.option_hard,
        "include_platinums": True,
        "custom_scaling_percentage": 100,
        "deathlink_enabled": 0,
    },
    "I'm MK": {
        "victory_condition": VictoryCondition.option_medals_count,
        "medal_count": 40,
        "accessible_countries_count": 13,
        "max_micro_countries_count": 1,
        "countries_max_difficulty": CountriesDifficultyLevel.option_hard,
        "include_platinums": False,
        "custom_scaling_percentage": 100,
        "deathlink_enabled": 0,
    },
    "I miss Explorer mode": {
        "victory_condition": VictoryCondition.option_plat_count,
        "medal_count": 119,
        "accessible_countries_count": 112,
        "max_micro_countries_count": 22,
        "countries_max_difficulty": CountriesDifficultyLevel.option_hard,
        "include_platinums": True,
        "custom_scaling_percentage": 100,
        "deathlink_enabled": 0,
    },
}


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
                and country.difficulty.value > common.Difficulty.MicroCountry.value
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
