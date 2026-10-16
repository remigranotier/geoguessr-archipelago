from enum import Enum

WORLD_REGION = "World"


class REGION(Enum):
    Europe = "Europe"
    Asia = "Asia"
    Africa = "Africa"
    North_America = "North America"
    South_America = "South America"
    Oceania = "Oceania"


# Difficulty levels for countries, defined as follows :
# - MicroCountry : very small countries or territories that make it very easy in move and no move
# - Easy : countries that often have good signs/addresses and clues for regionguessing
# - Medium : countries with less clues for pinpointing and regionguessing
# - Hard : countries that are mainly hard to pinpoint and often larger
# Some countries might be easy in move but hard in no move/nmpz and vice-versa
# In that case, the difficulty is based on the move difficulty since the medal thresholds will be balanced for NM/NMPZ
class Difficulty(Enum):
    MicroCountry = 0
    Easy = 1
    Medium = 2
    Hard = 3


# Used to offset IDs based on their region
REGION_BASE_IDS = {
    WORLD_REGION: 1,
    REGION.Europe: 1000,
    REGION.Asia: 2000,
    REGION.Africa: 3000,
    REGION.North_America: 4000,
    REGION.South_America: 5000,
    REGION.Oceania: 6000,
}


class FORBIDDENCOUNTRIES(Enum):
    Madagascar = "Madagascar"
    Greenland = "Greenland"
    Lebanon = "Lebanon"


class Country:
    def __init__(
        self,
        name: str,
        region: REGION,
        difficulty: Difficulty,
    ):
        self.name = name
        self.region = region
        self.difficulty = difficulty


class COUNTRIES(Enum):
    @classmethod
    def values(cls):
        return [c.value for c in cls]

    Albania = Country("Albania", REGION.Europe, Difficulty.Medium)
    Andorra = Country("Andorra", REGION.Europe, Difficulty.MicroCountry)
    Austria = Country("Austria", REGION.Europe, Difficulty.Easy)
    Belgium = Country("Belgium", REGION.Europe, Difficulty.Easy)
    Bosnia_and_Herzegovina = Country(
        "Bosnia and Herzegovina", REGION.Europe, Difficulty.Medium
    )
    Bulgaria = Country("Bulgaria", REGION.Europe, Difficulty.Easy)
    Croatia = Country("Croatia", REGION.Europe, Difficulty.Easy)
    Czech_Republic = Country("Czech Republic", REGION.Europe, Difficulty.Easy)
    Denmark = Country("Denmark", REGION.Europe, Difficulty.Easy)
    Estonia = Country("Estonia", REGION.Europe, Difficulty.Easy)
    Faroe_Islands = Country("Faroe Islands", REGION.Europe, Difficulty.MicroCountry)
    Finland = Country("Finland", REGION.Europe, Difficulty.Medium)
    France = Country("France", REGION.Europe, Difficulty.Easy)
    Germany = Country("Germany", REGION.Europe, Difficulty.Easy)
    Gibraltar = Country("Gibraltar", REGION.Europe, Difficulty.MicroCountry)
    Greece = Country("Greece", REGION.Europe, Difficulty.Medium)
    Hungary = Country("Hungary", REGION.Europe, Difficulty.Easy)
    Iceland = Country("Iceland", REGION.Europe, Difficulty.Easy)
    Ireland = Country("Ireland", REGION.Europe, Difficulty.Easy)
    Isle_of_Man = Country("Isle of Man", REGION.Europe, Difficulty.MicroCountry)
    Italy = Country("Italy", REGION.Europe, Difficulty.Easy)
    Jersey = Country("Jersey", REGION.Europe, Difficulty.MicroCountry)
    Latvia = Country("Latvia", REGION.Europe, Difficulty.Easy)
    Liechtenstein = Country("Liechtenstein", REGION.Europe, Difficulty.MicroCountry)
    Lithuania = Country("Lithuania", REGION.Europe, Difficulty.Easy)
    Luxembourg = Country("Luxembourg", REGION.Europe, Difficulty.Easy)
    Malta = Country("Malta", REGION.Europe, Difficulty.MicroCountry)
    Monaco = Country("Monaco", REGION.Europe, Difficulty.MicroCountry)
    Montenegro = Country("Montenegro", REGION.Europe, Difficulty.Medium)
    Netherlands = Country("Netherlands", REGION.Europe, Difficulty.Easy)
    North_Macedonia = Country("North Macedonia", REGION.Europe, Difficulty.Medium)
    Norway = Country("Norway", REGION.Europe, Difficulty.Medium)
    Poland = Country("Poland", REGION.Europe, Difficulty.Medium)
    Portugal = Country("Portugal", REGION.Europe, Difficulty.Easy)
    Romania = Country("Romania", REGION.Europe, Difficulty.Easy)
    San_Marino = Country("San Marino", REGION.Europe, Difficulty.MicroCountry)
    Serbia = Country("Serbia", REGION.Europe, Difficulty.Medium)
    Slovakia = Country("Slovakia", REGION.Europe, Difficulty.Easy)
    Slovenia = Country("Slovenia", REGION.Europe, Difficulty.Easy)
    Spain = Country("Spain", REGION.Europe, Difficulty.Easy)
    Sweden = Country("Sweden", REGION.Europe, Difficulty.Medium)
    Switzerland = Country("Switzerland", REGION.Europe, Difficulty.Easy)
    Turkiye = Country("Turkiye", REGION.Europe, Difficulty.Medium)
    Ukraine = Country("Ukraine", REGION.Europe, Difficulty.Medium)
    United_Kingdom = Country("United Kingdom", REGION.Europe, Difficulty.Easy)
    Bangladesh = Country("Bangladesh", REGION.Asia, Difficulty.Hard)
    Bhutan = Country("Bhutan", REGION.Asia, Difficulty.Medium)
    Cambodia = Country("Cambodia", REGION.Asia, Difficulty.Hard)
    Christmas_Island = Country("Christmas Island", REGION.Asia, Difficulty.MicroCountry)
    Cyprus = Country("Cyprus", REGION.Asia, Difficulty.Easy)
    Georgia = Country("Georgia", REGION.Asia, Difficulty.Medium)
    Hong_Kong = Country("Hong Kong", REGION.Asia, Difficulty.MicroCountry)
    India = Country("India", REGION.Asia, Difficulty.Hard)
    Indonesia = Country("Indonesia", REGION.Asia, Difficulty.Hard)
    Israel = Country("Israel", REGION.Asia, Difficulty.Easy)
    Japan = Country("Japan", REGION.Asia, Difficulty.Easy)
    Jordan = Country("Jordan", REGION.Asia, Difficulty.Medium)
    Kazakhstan = Country("Kazakhstan", REGION.Asia, Difficulty.Medium)
    Kyrgyzstan = Country("Kyrgyzstan", REGION.Asia, Difficulty.Medium)
    Laos = Country("Laos", REGION.Asia, Difficulty.MicroCountry)
    Macao = Country("Macao", REGION.Asia, Difficulty.MicroCountry)
    Malaysia = Country("Malaysia", REGION.Asia, Difficulty.Easy)
    Mongolia = Country("Mongolia", REGION.Asia, Difficulty.Medium)
    Nepal = Country("Nepal", REGION.Asia, Difficulty.Hard)
    Oman = Country("Oman", REGION.Asia, Difficulty.Hard)
    Philippines = Country("Philippines", REGION.Asia, Difficulty.Easy)
    Qatar = Country("Qatar", REGION.Asia, Difficulty.Medium)
    Russia = Country("Russia", REGION.Asia, Difficulty.Hard)
    Singapore = Country("Singapore", REGION.Asia, Difficulty.MicroCountry)
    South_Korea = Country("South Korea", REGION.Asia, Difficulty.Hard)
    Sri_Lanka = Country("Sri Lanka", REGION.Asia, Difficulty.Medium)
    Taiwan = Country("Taiwan", REGION.Asia, Difficulty.Easy)
    Thailand = Country("Thailand", REGION.Asia, Difficulty.Hard)
    United_Arab_Emirates = Country(
        "United Arab Emirates", REGION.Asia, Difficulty.Medium
    )
    Vietnam = Country("Vietnam", REGION.Asia, Difficulty.Medium)
    Botswana = Country("Botswana", REGION.Africa, Difficulty.Medium)
    Eswatini = Country("Eswatini", REGION.Africa, Difficulty.Easy)
    Ghana = Country("Ghana", REGION.Africa, Difficulty.Easy)
    Kenya = Country("Kenya", REGION.Africa, Difficulty.Hard)
    Lesotho = Country("Lesotho", REGION.Africa, Difficulty.Easy)
    Namibia = Country("Namibia", REGION.Africa, Difficulty.Hard)
    Nigeria = Country("Nigeria", REGION.Africa, Difficulty.Medium)
    Rwanda = Country("Rwanda", REGION.Africa, Difficulty.Medium)
    Sao_Tome_and_Principe = Country(
        "Sao Tome and Principe", REGION.Africa, Difficulty.MicroCountry
    )
    Senegal = Country("Senegal", REGION.Africa, Difficulty.Medium)
    South_Africa = Country("South Africa", REGION.Africa, Difficulty.Medium)
    Tunisia = Country("Tunisia", REGION.Africa, Difficulty.Easy)
    Uganda = Country("Uganda", REGION.Africa, Difficulty.MicroCountry)
    Canada = Country("Canada", REGION.North_America, Difficulty.Medium)
    Costa_Rica = Country("Costa Rica", REGION.North_America, Difficulty.Medium)
    Curacao = Country("Curacao", REGION.North_America, Difficulty.MicroCountry)
    Dominican_Republic = Country(
        "Dominican Republic", REGION.North_America, Difficulty.MicroCountry
    )
    Guatemala = Country("Guatemala", REGION.North_America, Difficulty.Medium)
    Mexico = Country("Mexico", REGION.North_America, Difficulty.Hard)
    Panama = Country("Panama", REGION.North_America, Difficulty.Medium)
    Puerto_Rico = Country("Puerto Rico", REGION.North_America, Difficulty.Easy)
    United_States = Country("United States", REGION.North_America, Difficulty.Easy)
    United_States_Virgin_Islands = Country(
        "United States Virgin Islands", REGION.North_America, Difficulty.MicroCountry
    )
    Argentina = Country("Argentina", REGION.South_America, Difficulty.Easy)
    Bolivia = Country("Bolivia", REGION.South_America, Difficulty.Medium)
    Brazil = Country("Brazil", REGION.South_America, Difficulty.Medium)
    Chile = Country("Chile", REGION.South_America, Difficulty.Easy)
    Colombia = Country("Colombia", REGION.South_America, Difficulty.Medium)
    Ecuador = Country("Ecuador", REGION.South_America, Difficulty.Medium)
    Paraguay = Country("Paraguay", REGION.South_America, Difficulty.Hard)
    Peru = Country("Peru", REGION.South_America, Difficulty.Medium)
    Uruguay = Country("Uruguay", REGION.South_America, Difficulty.Medium)
    American_Samoa = Country("American Samoa", REGION.Oceania, Difficulty.MicroCountry)
    Australia = Country("Australia", REGION.Oceania, Difficulty.Medium)
    Guam = Country("Guam", REGION.Oceania, Difficulty.MicroCountry)
    New_Zealand = Country("New Zealand", REGION.Oceania, Difficulty.Easy)
    Northern_Mariana_Islands = Country(
        "Northern Mariana Islands", REGION.Oceania, Difficulty.MicroCountry
    )


LOCATION_TYPES = [
    "Bronze Medal",
    "Silver Medal",
    "Gold Medal",
    "Platinum Medal",
    "First 5k",
]

ITEM_TYPES = ["Unlock", "Pan", "Move", "Zoom"]
