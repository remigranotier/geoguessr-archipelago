from enum import Enum


class REGION(Enum):
    World = "World"
    Europe = "Europe"
    Asia = "Asia"
    Africa = "Africa"
    North_America = "North America"
    South_America = "South America"
    Oceania = "Oceania"


# Used to offset IDs based on their region
REGION_BASE_IDS = {
    REGION.World: 1,
    REGION.Europe: 1000,
    REGION.Asia: 2000,
    REGION.Africa: 3000,
    REGION.North_America: 4000,
    REGION.South_America: 5000,
    REGION.Oceania: 6000,
}


class FORBIDDEN_COUNTRIES(Enum):
    Madagascar = "Madagascar"
    Greenland = "Greenland"
    Lebanon = "Lebanon"

class COUNTRY(Enum):
    Albania = "Albania"
    Andorra = "Andorra"
    Austria = "Austria"
    Belgium = "Belgium"
    Bosnia_and_Herzegovina = "Bosnia and Herzegovina"
    Bulgaria = "Bulgaria"
    Croatia = "Croatia"
    Czech_Republic = "Czech Republic"
    Denmark = "Denmark"
    Estonia = "Estonia"
    Faroe_Islands = "Faroe Islands"
    Finland = "Finland"
    France = "France"
    Germany = "Germany"
    Gibraltar = "Gibraltar"
    Greece = "Greece"
    Hungary = "Hungary"
    Iceland = "Iceland"
    Ireland = "Ireland"
    Isle_of_Man = "Isle of Man"
    Italy = "Italy"
    Jersey = "Jersey"
    Latvia = "Latvia"
    Liechtenstein = "Liechtenstein"
    Lithuania = "Lithuania"
    Luxembourg = "Luxembourg"
    Malta = "Malta"
    Monaco = "Monaco"
    Montenegro = "Montenegro"
    Netherlands = "Netherlands"
    North_Macedonia = "North Macedonia"
    Norway = "Norway"
    Poland = "Poland"
    Portugal = "Portugal"
    Romania = "Romania"
    San_Marino = "San Marino"
    Serbia = "Serbia"
    Slovakia = "Slovakia"
    Slovenia = "Slovenia"
    Spain = "Spain"
    Sweden = "Sweden"
    Switzerland = "Switzerland"
    Turkiye = "Turkiye",
    Ukraine = "Ukraine"
    United_Kingdom = "United Kingdom"
    Bangladesh = "Bangladesh"
    Bhutan = "Bhutan"
    Cambodia = "Cambodia"
    Christmas_Island = "Christmas Island"
    Cyprus = "Cyprus"
    Georgia = "Georgia"
    Hong_Kong = "Hong Kong"
    India = "India"
    Indonesia = "Indonesia"
    Israel = "Israel"
    Japan = "Japan"
    Jordan = "Jordan"
    Kazakhstan = "Kazakhstan"
    Kyrgyzstan = "Kyrgyzstan"
    Laos = "Laos"
    Macao = "Macao"
    Malaysia = "Malaysia"
    Mongolia = "Mongolia"
    Nepal = "Nepal"
    Oman = "Oman"
    Philippines = "Philippines"
    Qatar = "Qatar"
    Russia = "Russia"
    Singapore = "Singapore"
    South_Korea = "South Korea"
    Sri_Lanka = "Sri Lanka"
    Taiwan = "Taiwan"
    Thailand = "Thailand"
    United_Arab_Emirates = "United Arab Emirates"
    Vietnam = "Vietnam"
    Botswana = "Botswana"
    Eswatini = "Eswatini"
    Ghana = "Ghana"
    Kenya = "Kenya"
    Lesotho = "Lesotho"
    Namibia = "Namibia"
    Nigeria = "Nigeria"
    Rwanda = "Rwanda"
    Sao_Tome_and_Principe = "São Tomé and Príncipe", 
    Senegal = "Senegal"
    South_Africa = "South Africa"
    Tunisia = "Tunisia"
    Uganda = "Uganda"
    Canada = "Canada"
    Costa_Rica = "Costa Rica"
    Curacao = "Curacao"
    Dominican_Republic = "Dominican Republic"
    Guatemala = "Guatemala"
    Mexico = "Mexico"
    Panama = "Panama"
    Puerto_Rico = "Puerto Rico"
    United_States = "United States"
    United_States_Virgin_Islands = "United States Virgin Islands"
    Argentina = "Argentina"
    Bolivia = "Bolivia"
    Brazil = "Brazil"
    Chile = "Chile"
    Colombia = "Colombia"
    Ecuador = "Ecuador"
    Paraguay = "Paraguay"
    Peru = "Peru"
    Uruguay = "Uruguay"
    American_Samoa = "American Samoa"
    Australia = "Australia"
    Guam = "Guam"
    New_Zealand = "New Zealand"
    Northern_Mariana_Islands = "Northern Mariana Islands"

EUROPE_COUNTRY_NAMES = [
    COUNTRY.Albania,
    COUNTRY.Andorra,
    COUNTRY.Austria,
    COUNTRY.Belgium,
    COUNTRY.Bosnia_and_Herzegovina,
    COUNTRY.Bulgaria,
    COUNTRY.Croatia,
    COUNTRY.Czech_Republic,
    COUNTRY.Denmark,
    COUNTRY.Estonia,
    COUNTRY.Faroe_Islands,
    COUNTRY.Finland,
    COUNTRY.France,
    COUNTRY.Germany,
    COUNTRY.Gibraltar,
    COUNTRY.Greece,
    COUNTRY.Hungary,
    COUNTRY.Iceland,
    COUNTRY.Ireland,
    COUNTRY.Isle_of_Man,
    COUNTRY.Italy,
    COUNTRY.Jersey,
    COUNTRY.Latvia,
    COUNTRY.Liechtenstein,
    COUNTRY.Lithuania,
    COUNTRY.Luxembourg,
    COUNTRY.Malta,
    COUNTRY.Monaco,
    COUNTRY.Montenegro,
    COUNTRY.Netherlands,
    COUNTRY.North_Macedonia,
    COUNTRY.Norway,
    COUNTRY.Poland,
    COUNTRY.Portugal,
    COUNTRY.Romania,
    COUNTRY.San_Marino,
    COUNTRY.Serbia,
    COUNTRY.Slovakia,
    COUNTRY.Slovenia,
    COUNTRY.Spain,
    COUNTRY.Sweden,
    COUNTRY.Switzerland,
    COUNTRY.Turkiye,
    COUNTRY.Ukraine,
    COUNTRY.United_Kingdom,
]

ASIA_COUNTRY_NAMES = [
    COUNTRY.Bangladesh,
    COUNTRY.Bhutan,
    COUNTRY.Cambodia,
    COUNTRY.Christmas_Island,
    COUNTRY.Cyprus,
    COUNTRY.Georgia,
    COUNTRY.Hong_Kong,
    COUNTRY.India,
    COUNTRY.Indonesia,
    COUNTRY.Israel,
    COUNTRY.Japan,
    COUNTRY.Jordan,
    COUNTRY.Kazakhstan,
    COUNTRY.Kyrgyzstan,
    COUNTRY.Laos,
    COUNTRY.Macao,
    COUNTRY.Malaysia,
    COUNTRY.Mongolia,
    COUNTRY.Nepal,
    COUNTRY.Oman,
    COUNTRY.Philippines,
    COUNTRY.Qatar,
    COUNTRY.Russia,
    COUNTRY.Singapore,
    COUNTRY.South_Korea,
    COUNTRY.Sri_Lanka,
    COUNTRY.Taiwan,
    COUNTRY.Thailand,
    COUNTRY.United_Arab_Emirates,
    COUNTRY.Vietnam,
]

AFRICA_COUNTRY_NAMES = [
    COUNTRY.Botswana,
    COUNTRY.Eswatini,
    COUNTRY.Ghana,
    COUNTRY.Kenya,
    COUNTRY.Lesotho,
    COUNTRY.Namibia,
    COUNTRY.Nigeria,
    COUNTRY.Rwanda,
    COUNTRY.Sao_Tome_and_Principe, 
    COUNTRY.Senegal,
    COUNTRY.South_Africa,
    COUNTRY.Tunisia,
    COUNTRY.Uganda,
]

NORTH_AMERICA_COUNTRY_NAMES = [
    COUNTRY.Canada,
    COUNTRY.Costa_Rica,
    COUNTRY.Curacao,
    COUNTRY.Dominican_Republic,
    COUNTRY.Guatemala,
    COUNTRY.Mexico,
    COUNTRY.Panama,
    COUNTRY.Puerto_Rico,
    COUNTRY.United_States,
    COUNTRY.United_States_Virgin_Islands,
]

SOUTH_AMERICA_COUNTRY_NAMES = [
    COUNTRY.Argentina,
    COUNTRY.Bolivia,
    COUNTRY.Brazil,
    COUNTRY.Chile,
    COUNTRY.Colombia,
    COUNTRY.Ecuador,
    COUNTRY.Paraguay,
    COUNTRY.Peru,
    COUNTRY.Uruguay,
]

OCEANIA_COUNTRY_NAMES = [
    COUNTRY.American_Samoa,
    COUNTRY.Australia,
    COUNTRY.Guam,
    COUNTRY.New_Zealand,
    COUNTRY.Northern_Mariana_Islands,
]

LOCATION_TYPES = [
    "Bronze Medal",
    "Silver Medal",
    "Gold Medal",
    "Platinum Medal",
    "First 5k",
]

ITEM_TYPES = ["Unlock", "Pan", "Move", "Zoom"]

ALL_COUNTRIES_PER_REGION = {
    REGION.World: [],
    REGION.Europe: EUROPE_COUNTRY_NAMES,
    REGION.Asia: ASIA_COUNTRY_NAMES,
    REGION.Africa: AFRICA_COUNTRY_NAMES,
    REGION.North_America: NORTH_AMERICA_COUNTRY_NAMES,
    REGION.South_America: SOUTH_AMERICA_COUNTRY_NAMES,
    REGION.Oceania: OCEANIA_COUNTRY_NAMES,
}
