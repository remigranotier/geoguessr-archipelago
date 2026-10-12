export enum WorldNumber {
    World = 1
}

export enum ContinentNumber {
    Europe = 1,
    Asia,
    Africa,
    North_America,
    South_America,
    Oceania
}

export enum EuropeCountryNumber {
    Albania = 1,
    Andorra,
    Austria,
    Belgium,
    Bosnia_and_Herzegovina,
    Bulgaria,
    Croatia,
    Czech_Republic,
    Denmark,
    Estonia,
    Faroe_Islands,
    Finland,
    France,
    Germany,
    Gibraltar,
    Greece,
    Hungary,
    Iceland,
    Ireland,
    Isle_of_Man,
    Italy,
    Jersey,
    Latvia,
    Liechtenstein,
    Lithuania,
    Luxembourg,
    Malta,
    Monaco,
    Montenegro,
    Netherlands,
    North_Macedonia,
    Norway,
    Poland,
    Portugal,
    Romania,
    San_Marino,
    Serbia,
    Slovakia,
    Slovenia,
    Spain,
    Sweden,
    Switzerland,
    Turkiye,
    Ukraine,
    United_Kingdom,
}

export enum AsiaCountryNumber {
    Bangladesh = 1,
    Bhutan,
    Cambodia,
    Christmas_Island,
    Cyprus,
    Georgia,
    Hong_Kong,
    India,
    Indonesia,
    Israel,
    Japan,
    Jordan,
    Kazakhstan,
    Kyrgyzstan,
    Laos,
    Macao,
    Malaysia,
    Mongolia,
    Nepal,
    Oman,
    Philippines,
    Qatar,
    Russia,
    Singapore,
    South_Korea,
    Sri_Lanka,
    Taiwan,
    Thailand,
    United_Arab_Emirates,
    Vietnam,
}

export enum AfricaCountryNumber {
    Botswana = 1,
    Eswatini,
    Ghana,
    Kenya,
    Lesotho,
    Namibia,
    Nigeria,
    Rwanda,
    Sao_Tome_and_Principe,
    Senegal,
    South_Africa,
    Tunisia,
    Uganda,
}

export enum NorthAmericaCountryNumber {
    Canada = 1,
    Costa_Rica,
    Curacao,
    Dominican_Republic,
    Guatemala,
    Mexico,
    Panama,
    Puerto_Rico,
    United_States,
    United_States_Virgin_Islands,
}

export enum SouthAmericaCountryNumber {
    Argentina = 1,
    Bolivia,
    Brazil,
    Chile,
    Colombia,
    Ecuador,
    Paraguay,
    Peru,
    Uruguay,
}

export enum OceaniaCountryNumber {
    American_Samoa = 1,
    Australia,
    Guam,
    New_Zealand,
    Northern_Mariana_Islands,
}

export type World = {
    kind: "world";
    worldNumber: WorldNumber;
};

export type Continent = {
    kind: "continent";
    continentNumber: ContinentNumber;
};

export type Country<C extends ContinentNumber = ContinentNumber> = {
    kind: "country";
    continentNumber: C;
    countryNumber: number;
}