from dataclasses import dataclass

from Options import Choice, PerGameCommonOptions, Range

from . import common


def get_map_amount() -> int:
    return len(common.WORLD_REGION) + len(common.REGION) + len(common.COUNTRIES)


class VictoryCondition(Choice):
    """
    The condition that must be met to win the run.
    """

    display_name = "Victory Condition"

    option_medals_count = (
        0  # Reach a certain amount of medals in the game, chosen with another option
    )
    option_plat_count = (
        1  # Reach a set amount of platinum medals, chosen with another option
    )

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
    range_end = len([country for country in common.COUNTRIES.values() if country.is_micro])
    default = 3


@dataclass
class GeoguessrOptions(PerGameCommonOptions):
    victory_condition: VictoryCondition
    medal_count: MedalCount
    plat_count: PlatCount
    accessible_countries_count: AccessibleCountriesCount
    max_micro_countries_count: MaxMicroCountriesCount
