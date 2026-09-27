from BaseClasses import Tutorial
from worlds.AutoWorld import WebWorld

from .options import option_groups, option_presets

# This class is used to define how the game option page will be displayed on the website.

class GeoguessrWebWorld(WebWorld):
    game = "Geoguessr"

    theme = "grassFlowers"

    setup_en = Tutorial(
        "Multiworld Setup Guide",
        "A guide to setting up Geoguessr for MultiWorld.",
        "English",
        "setup_en.md",
        "setup/en",
        ["Evandar", "LeRemiii"],
    )

    tutorials = [setup_en]