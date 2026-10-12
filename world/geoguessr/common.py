from enum import Enum

WORLD_REGION = "World"


class REGION(Enum):
    Europe = "Europe"
    Asia = "Asia"
    Africa = "Africa"
    North_America = "North America"
    South_America = "South America"
    Oceania = "Oceania"


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
    def __init__(self, name: str, region: REGION, is_micro: bool = False):
        self.name = name
        self.region = region
        self.is_micro = is_micro


class COUNTRIES(Enum):
    @classmethod
    def values(cls):
        return [c.value for c in cls]

    Albania = Country("Albania", REGION.Europe)
    Andorra = Country("Andorra", REGION.Europe, is_micro=True)
    Austria = Country("Austria", REGION.Europe)
    Belgium = Country("Belgium", REGION.Europe)
    Bosnia_and_Herzegovina = Country("Bosnia and Herzegovina", REGION.Europe)
    Bulgaria = Country("Bulgaria", REGION.Europe)
    Croatia = Country("Croatia", REGION.Europe)
    Czech_Republic = Country("Czech Republic", REGION.Europe)
    Denmark = Country("Denmark", REGION.Europe)
    Estonia = Country("Estonia", REGION.Europe)
    Faroe_Islands = Country("Faroe Islands", REGION.Europe, is_micro=True)
    Finland = Country("Finland", REGION.Europe)
    France = Country("France", REGION.Europe)
    Germany = Country("Germany", REGION.Europe)
    Gibraltar = Country("Gibraltar", REGION.Europe, is_micro=True)
    Greece = Country("Greece", REGION.Europe)
    Hungary = Country("Hungary", REGION.Europe)
    Iceland = Country("Iceland", REGION.Europe)
    Ireland = Country("Ireland", REGION.Europe)
    Isle_of_Man = Country("Isle of Man", REGION.Europe, is_micro=True)
    Italy = Country("Italy", REGION.Europe)
    Jersey = Country("Jersey", REGION.Europe, is_micro=True)
    Latvia = Country("Latvia", REGION.Europe)
    Liechtenstein = Country("Liechtenstein", REGION.Europe, is_micro=True)
    Lithuania = Country("Lithuania", REGION.Europe)
    Luxembourg = Country("Luxembourg", REGION.Europe)
    Malta = Country("Malta", REGION.Europe, is_micro=True)
    Monaco = Country("Monaco", REGION.Europe, is_micro=True)
    Montenegro = Country("Montenegro", REGION.Europe)
    Netherlands = Country("Netherlands", REGION.Europe)
    North_Macedonia = Country("North Macedonia", REGION.Europe)
    Norway = Country("Norway", REGION.Europe)
    Poland = Country("Poland", REGION.Europe)
    Portugal = Country("Portugal", REGION.Europe)
    Romania = Country("Romania", REGION.Europe)
    San_Marino = Country("San Marino", REGION.Europe, is_micro=True)
    Serbia = Country("Serbia", REGION.Europe)
    Slovakia = Country("Slovakia", REGION.Europe)
    Slovenia = Country("Slovenia", REGION.Europe)
    Spain = Country("Spain", REGION.Europe)
    Sweden = Country("Sweden", REGION.Europe)
    Switzerland = Country("Switzerland", REGION.Europe)
    Turkiye = Country("Turkiye", REGION.Europe)
    Ukraine = Country("Ukraine", REGION.Europe)
    United_Kingdom = Country("United Kingdom", REGION.Europe)
    Bangladesh = Country("Bangladesh", REGION.Asia)
    Bhutan = Country("Bhutan", REGION.Asia)
    Cambodia = Country("Cambodia", REGION.Asia)
    Christmas_Island = Country("Christmas Island", REGION.Asia, is_micro=True)
    Cyprus = Country("Cyprus", REGION.Asia)
    Georgia = Country("Georgia", REGION.Asia)
    Hong_Kong = Country("Hong Kong", REGION.Asia, is_micro=True)
    India = Country("India", REGION.Asia)
    Indonesia = Country("Indonesia", REGION.Asia)
    Israel = Country("Israel", REGION.Asia)
    Japan = Country("Japan", REGION.Asia)
    Jordan = Country("Jordan", REGION.Asia)
    Kazakhstan = Country("Kazakhstan", REGION.Asia)
    Kyrgyzstan = Country("Kyrgyzstan", REGION.Asia)
    Laos = Country("Laos", REGION.Asia, is_micro=True)
    Macao = Country("Macao", REGION.Asia, is_micro=True)
    Malaysia = Country("Malaysia", REGION.Asia)
    Mongolia = Country("Mongolia", REGION.Asia)
    Nepal = Country("Nepal", REGION.Asia)
    Oman = Country("Oman", REGION.Asia)
    Philippines = Country("Philippines", REGION.Asia)
    Qatar = Country("Qatar", REGION.Asia)
    Russia = Country("Russia", REGION.Asia)
    Singapore = Country("Singapore", REGION.Asia, is_micro=True)
    South_Korea = Country("South Korea", REGION.Asia)
    Sri_Lanka = Country("Sri Lanka", REGION.Asia)
    Taiwan = Country("Taiwan", REGION.Asia)
    Thailand = Country("Thailand", REGION.Asia)
    United_Arab_Emirates = Country("United Arab Emirates", REGION.Asia)
    Vietnam = Country("Vietnam", REGION.Asia)
    Botswana = Country("Botswana", REGION.Africa)
    Eswatini = Country("Eswatini", REGION.Africa)
    Ghana = Country("Ghana", REGION.Africa)
    Kenya = Country("Kenya", REGION.Africa)
    Lesotho = Country("Lesotho", REGION.Africa)
    Namibia = Country("Namibia", REGION.Africa)
    Nigeria = Country("Nigeria", REGION.Africa)
    Rwanda = Country("Rwanda", REGION.Africa)
    Sao_Tome_and_Principe = Country(
        "Sao Tome and Principe", REGION.Africa, is_micro=True
    )
    Senegal = Country("Senegal", REGION.Africa)
    South_Africa = Country("South Africa", REGION.Africa)
    Tunisia = Country("Tunisia", REGION.Africa)
    Uganda = Country("Uganda", REGION.Africa, is_micro=True)
    Canada = Country("Canada", REGION.North_America)
    Costa_Rica = Country("Costa Rica", REGION.North_America)
    Curacao = Country("Curacao", REGION.North_America, is_micro=True)
    Dominican_Republic = Country(
        "Dominican Republic", REGION.North_America, is_micro=True
    )
    Guatemala = Country("Guatemala", REGION.North_America)
    Mexico = Country("Mexico", REGION.North_America)
    Panama = Country("Panama", REGION.North_America)
    Puerto_Rico = Country("Puerto Rico", REGION.North_America)
    United_States = Country("United States", REGION.North_America)
    United_States_Virgin_Islands = Country(
        "United States Virgin Islands", REGION.North_America, True
    )
    Argentina = Country("Argentina", REGION.South_America)
    Bolivia = Country("Bolivia", REGION.South_America)
    Brazil = Country("Brazil", REGION.South_America)
    Chile = Country("Chile", REGION.South_America)
    Colombia = Country("Colombia", REGION.South_America)
    Ecuador = Country("Ecuador", REGION.South_America)
    Paraguay = Country("Paraguay", REGION.South_America)
    Peru = Country("Peru", REGION.South_America)
    Uruguay = Country("Uruguay", REGION.South_America)
    American_Samoa = Country("American Samoa", REGION.Oceania, is_micro=True)
    Australia = Country("Australia", REGION.Oceania)
    Guam = Country("Guam", REGION.Oceania, is_micro=True)
    New_Zealand = Country("New Zealand", REGION.Oceania)
    Northern_Mariana_Islands = Country(
        "Northern Mariana Islands", REGION.Oceania, is_micro=True
    )


LOCATION_TYPES = [
    "Bronze Medal",
    "Silver Medal",
    "Gold Medal",
    "Platinum Medal",
    "First 5k",
]

ITEM_TYPES = ["Unlock", "Pan", "Move", "Zoom"]
