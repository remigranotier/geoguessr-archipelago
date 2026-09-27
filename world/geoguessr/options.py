from dataclasses import dataclass

from Options import Choice, OptionGroup, PerGameCommonOptions, Range, Toggle

class VictoryCondition(Choice):
    """
    The condition that must be met to win the run.
    """

    display_name = "Victory Condition"

    option_medals_count = 0 # Reach a certain amount of medals in the game, chosen with another option
    option_plat_count = 1 # Reach a set amount of platinum medals, chosen with another option

    # Choice options must define an explicit default value.
    default = option_medals_count

class MedalCount(Range):
    """
    The number of medals the player must collect to win the run.
    """

    display_name = "Medal Count"

    range_start = 1
    range_end = 6
    default = 8

class PlatCount(Range):
    """
    The number of platinum medals the player must collect to win the run.
    """

    display_name = "Platinum Medal Count"

    range_start = 1
    range_end = 2
    default = 2

@dataclass
class GeoguessrOptions(PerGameCommonOptions):
    victory_condition: VictoryCondition
    medal_count: MedalCount
    plat_count: PlatCount