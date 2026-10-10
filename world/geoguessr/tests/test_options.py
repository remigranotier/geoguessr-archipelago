from worlds.geoguessr import common
from worlds.geoguessr.tests.bases import GeoguessrTestBase


class TestMoreCountries(GeoguessrTestBase):
    options = {  # noqa: RUF012
        "victory_condition": 1,
        "plat_count": 10,
        "accessible_countries_count": 50,
        "max_micro_countries_count": 5
    }

class TestAllCountriesPlatinum(GeoguessrTestBase):
    number_of_maps = 1 + len(common.REGION) + len(common.COUNTRIES)
    number_of_countries = len(common.COUNTRIES)
    number_of_micro_countries = len([country for country in common.COUNTRIES.values() if country.is_micro])
    options = {  # noqa: RUF012
        "victory_condition": 1,
        "plat_count": number_of_maps,
        "accessible_countries_count": number_of_countries,
        "max_micro_countries_count": number_of_micro_countries
    }
