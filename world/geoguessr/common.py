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
    def __init__(self, name: str, region: REGION, is_micro: bool):
        self.name = name
        self.region = region
        self.is_micro = is_micro

class COUNTRIES(Enum):
    @classmethod
    def values(cls):
        return [c.value for c in cls]

    Albania = Country("Albania", REGION.Europe, False)
    Andorra = Country("Andorra", REGION.Europe, True)
    Austria = Country("Austria", REGION.Europe, False)
    Belgium = Country("Belgium", REGION.Europe, False)
    Bosnia_and_Herzegovina = Country("Bosnia and Herzegovina", REGION.Europe, False)
    Bulgaria = Country("Bulgaria", REGION.Europe, False)
    Croatia = Country("Croatia", REGION.Europe, False)
    Czech_Republic = Country("Czech Republic", REGION.Europe, False)
    Denmark = Country("Denmark", REGION.Europe, False)
    Estonia = Country("Estonia", REGION.Europe, False)
    Faroe_Islands = Country("Faroe Islands", REGION.Europe, True)
    Finland = Country("Finland", REGION.Europe, False)
    France = Country("France", REGION.Europe, False)
    Germany = Country("Germany", REGION.Europe, False)
    Gibraltar = Country("Gibraltar", REGION.Europe, True)
    Greece = Country("Greece", REGION.Europe, False)
    Hungary = Country("Hungary", REGION.Europe, False)
    Iceland = Country("Iceland", REGION.Europe, False)
    Ireland = Country("Ireland", REGION.Europe, False)
    Isle_of_Man = Country("Isle of Man", REGION.Europe, True)
    Italy = Country("Italy", REGION.Europe, False)
    Jersey = Country("Jersey", REGION.Europe, True)
    Latvia = Country("Latvia", REGION.Europe, False)
    Liechtenstein = Country("Liechtenstein", REGION.Europe, True)
    Lithuania = Country("Lithuania", REGION.Europe, False)
    Luxembourg = Country("Luxembourg", REGION.Europe, False)
    Malta = Country("Malta", REGION.Europe, True)
    Monaco = Country("Monaco", REGION.Europe, True)
    Montenegro = Country("Montenegro", REGION.Europe, False)
    Netherlands = Country("Netherlands", REGION.Europe, False)
    North_Macedonia = Country("North Macedonia", REGION.Europe, False)
    Norway = Country("Norway", REGION.Europe, False)
    Poland = Country("Poland", REGION.Europe, False)
    Portugal = Country("Portugal", REGION.Europe, False)
    Romania = Country("Romania", REGION.Europe, False)
    San_Marino = Country("San Marino", REGION.Europe, True)
    Serbia = Country("Serbia", REGION.Europe, False)
    Slovakia = Country("Slovakia", REGION.Europe, False)
    Slovenia = Country("Slovenia", REGION.Europe, False)
    Spain = Country("Spain", REGION.Europe, False)
    Sweden = Country("Sweden", REGION.Europe, False)
    Switzerland = Country("Switzerland", REGION.Europe, False)
    Turkiye = Country("Turkiye", REGION.Europe, False)
    Ukraine = Country("Ukraine", REGION.Europe, False)
    United_Kingdom = Country("United Kingdom", REGION.Europe, False)
    Bangladesh = Country("Bangladesh", REGION.Asia, False)
    Bhutan = Country("Bhutan", REGION.Asia, False)
    Cambodia = Country("Cambodia", REGION.Asia, False)
    Christmas_Island = Country("Christmas Island", REGION.Asia, True)
    Cyprus = Country("Cyprus", REGION.Asia, False)
    Georgia = Country("Georgia", REGION.Asia, False)
    Hong_Kong = Country("Hong Kong", REGION.Asia, True)
    India = Country("India", REGION.Asia, False)
    Indonesia = Country("Indonesia", REGION.Asia, False)
    Israel = Country("Israel", REGION.Asia, False)
    Japan = Country("Japan", REGION.Asia, False)
    Jordan = Country("Jordan", REGION.Asia, False)
    Kazakhstan = Country("Kazakhstan", REGION.Asia, False)
    Kyrgyzstan = Country("Kyrgyzstan", REGION.Asia, False)
    Laos = Country("Laos", REGION.Asia, True)
    Macao = Country("Macao", REGION.Asia, True)
    Malaysia = Country("Malaysia", REGION.Asia, False)
    Mongolia = Country("Mongolia", REGION.Asia, False)
    Nepal = Country("Nepal", REGION.Asia, False)
    Oman = Country("Oman", REGION.Asia, False)
    Philippines = Country("Philippines", REGION.Asia, False)
    Qatar = Country("Qatar", REGION.Asia, False)
    Russia = Country("Russia", REGION.Asia, False)
    Singapore = Country("Singapore", REGION.Asia, True)
    South_Korea = Country("South Korea", REGION.Asia, False)
    Sri_Lanka = Country("Sri Lanka", REGION.Asia, False)
    Taiwan = Country("Taiwan", REGION.Asia, False)
    Thailand = Country("Thailand", REGION.Asia, False)
    United_Arab_Emirates = Country("United Arab Emirates", REGION.Asia, False)
    Vietnam = Country("Vietnam", REGION.Asia, False)
    Botswana = Country("Botswana", REGION.Africa, False)
    Eswatini = Country("Eswatini", REGION.Africa, False)
    Ghana = Country("Ghana", REGION.Africa, False)
    Kenya = Country("Kenya", REGION.Africa, False)
    Lesotho = Country("Lesotho", REGION.Africa, False)
    Namibia = Country("Namibia", REGION.Africa, False)
    Nigeria = Country("Nigeria", REGION.Africa, False)
    Rwanda = Country("Rwanda", REGION.Africa, False)
    Sao_Tome_and_Principe = Country("Sao Tome and Principe", REGION.Africa, True)
    Senegal = Country("Senegal", REGION.Africa, False)
    South_Africa = Country("South Africa", REGION.Africa, False)
    Tunisia = Country("Tunisia", REGION.Africa, False)
    Uganda = Country("Uganda", REGION.Africa, True)
    Canada = Country("Canada", REGION.North_America, False)
    Costa_Rica = Country("Costa Rica", REGION.North_America, False)
    Curacao = Country("Curacao", REGION.North_America, True)
    Dominican_Republic = Country("Dominican Republic", REGION.North_America, True)
    Guatemala = Country("Guatemala", REGION.North_America, False)
    Mexico = Country("Mexico", REGION.North_America, False)
    Panama = Country("Panama", REGION.North_America, False)
    Puerto_Rico = Country("Puerto Rico", REGION.North_America, False)
    United_States = Country("United States", REGION.North_America, False)
    United_States_Virgin_Islands = Country("United States Virgin Islands", REGION.North_America, True)
    Argentina = Country("Argentina", REGION.South_America, False)
    Bolivia = Country("Bolivia", REGION.South_America, False)
    Brazil = Country("Brazil", REGION.South_America, False)
    Chile = Country("Chile", REGION.South_America, False)
    Colombia = Country("Colombia", REGION.South_America, False)
    Ecuador = Country("Ecuador", REGION.South_America, False)
    Paraguay = Country("Paraguay", REGION.South_America, False)
    Peru = Country("Peru", REGION.South_America, False)
    Uruguay = Country("Uruguay", REGION.South_America, False)
    American_Samoa = Country("American Samoa", REGION.Oceania, True)
    Australia = Country("Australia", REGION.Oceania, False)
    Guam = Country("Guam", REGION.Oceania, True)
    New_Zealand = Country("New Zealand", REGION.Oceania, False)
    Northern_Mariana_Islands = Country("Northern Mariana Islands", REGION.Oceania, True)


LOCATION_TYPES = [
    "Bronze Medal",
    "Silver Medal",
    "Gold Medal",
    "Platinum Medal",
    "First 5k",
]

ITEM_TYPES = ["Unlock", "Pan", "Move", "Zoom"]