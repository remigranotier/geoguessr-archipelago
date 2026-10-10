import { GACMedal } from "./models";

const LOCATIONS_PER_MAP = 5 // Bronze, Silver, Gold, Platinum, 5k
export const ITEMS_PER_MAP = 4 // Unlock, Pan, Move, Zoom

export enum AreaLocations {
    Bronze = 0,
    Silver = 1,
    Gold = 2,
    Platinum = 3,
    FiveK = 4,
}

export enum AreaItems {
    Unlock = 0,
    Pan = 1,
    Move = 2,
    Zoom = 3
}

export const medalThresholds: Record<GACMedal, number> = {
    [GACMedal.None]: 0,
    [GACMedal.Bronze]: 7500,
    [GACMedal.Silver]: 15000,
    [GACMedal.Gold]: 22500,
    [GACMedal.Platinum]: 25000,
}

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

export type Area =
    | World
    | Continent
    | Country;

export class AreaMap {
    area: Area
    areaName: string
    baseLocationId: number
    baseItemId: number
    mapId: string
    mapName: string

    constructor(area: Area, areaName: string, mapId: string, mapName: string) {
        this.area = area
        this.areaName = areaName
        this.baseLocationId = this.getBaseLocationId(this.area)
        this.baseItemId = this.getBaseItemId(this.area)
        this.mapId = mapId
        this.mapName = mapName
    }

    getBaseLocationId(area: Area): number {
        switch (area.kind) {
            case "world":
                return 1;

            case "continent":
                return 1000 * area.continentNumber;

            case "country":
                return 1000 * area.continentNumber + LOCATIONS_PER_MAP * area.countryNumber;
        }
    }

    getBaseItemId(area: Area): number {
        switch (area.kind) {
            case "world":
                return 1;

            case "continent":
                return 1000 * area.continentNumber;

            case "country":
                return 1000 * area.continentNumber + ITEMS_PER_MAP * area.countryNumber;
        }
    }
}

let allMaps: AreaMap[] = []

// Continent Maps
allMaps.push(
    // World Maps
    new AreaMap({ kind: "world", worldNumber: WorldNumber.World }, "World", "652ba0d9002aa0d36f996153", "An Official World"),

    // Continent Maps
    new AreaMap({ kind: "continent", continentNumber: ContinentNumber.Europe }, "Europe", "6932d6719534d4b56d600fa1", "Coupe de la Ligue - Europe"), 
    new AreaMap({ kind: "continent", continentNumber: ContinentNumber.Asia }, "Asia", "6932ba0e481c655f4f6c6a56", "Coupe de la Ligue - Asia"), 
    new AreaMap({ kind: "continent", continentNumber: ContinentNumber.Africa }, "Africa", "6932ad9b1b23225b2c22e420", "Coupe de la Ligue - Africa"), 
    new AreaMap({ kind: "continent", continentNumber: ContinentNumber.North_America }, "North America", "69367baba92b1c6d29fda74f", "Coupe de la Ligue - North America"), 
    new AreaMap({ kind: "continent", continentNumber: ContinentNumber.South_America }, "South America", "69369c4ea92b1c6d29fe244a", "Coupe de la Ligue - South America"), 
    new AreaMap({ kind: "continent", continentNumber: ContinentNumber.Oceania }, "Oceania", "693040234d42b055fcaf1781", "Coupe de la Ligue - Oceania"),
    
    // Europe Maps
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Albania }, "Albania", "6616429cd61e067ae0969a69", "Coupe de la Ligue - Albania"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Andorra }, "Andorra", "6616534acf3ea74960e46aef", "Coupe de la Ligue - Andorra"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Austria }, "Austria", "6616539bfb19f1fdea2bc556", "Coupe de la Ligue - Austria"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Belgium }, "Belgium", "6616543de248f096ec9b76e4", "Coupe de la Ligue - Belgium"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Bosnia_and_Herzegovina }, "Bosnia & Herzegovina", "6909d4a9f14c4e0891fd79e0", "Coupe de la Ligue - Bosnia & Herzegovina"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Bulgaria }, "Bulgaria", "66165546a81e8da8b7195da6", "Coupe de la Ligue - Bulgaria"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Croatia }, "Croatia", "661655c2be08f9b164ba7ee1", "Coupe de la Ligue - Croatia"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Czech_Republic }, "Czechia", "66167e09962c0880ae03e5a5", "Coupe de la Ligue - Czechia"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Denmark }, "Denmark", "6616562e9d295bf4901bfdf2", "Coupe de la Ligue - Denmark"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Estonia }, "Estonia", "66165933f31375669b01a04f", "Coupe de la Ligue - Estonia"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Faroe_Islands }, "Faroe Islands", "66165ea09d295bf4901c09e4", "Coupe de la Ligue - Faroe Islands"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Finland }, "Finland", "6616599cd61e067ae096c946", "Coupe de la Ligue - Finland"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.France }, "France", "661659f9a81e8da8b71965b4", "Coupe de la Ligue - France"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Germany }, "Germany", "661652dbed5d1147573f5e63", "Coupe de la Ligue - Germany"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Gibraltar }, "Gibraltar", "66165cd03b6ff9c413d97316", "Coupe de la Ligue - Gibraltar"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Greece }, "Greece", "66165cf54e2a0b9d8db9b8c7", "Coupe de la Ligue - Greece"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Hungary }, "Hungary", "66165e261e1d7708d0276782", "Coupe de la Ligue - Hungary"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Iceland }, "Iceland", "66165faf3b6ff9c413d97738", "Coupe de la Ligue - Iceland"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Ireland }, "Ireland", "66165ee4ab257b1970743a4d", "Coupe de la Ligue - Ireland"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Isle_of_Man }, "Isle of Man", "66165e73e248f096ec9b86c1", "Coupe de la Ligue - Isle of Man"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Italy }, "Italy", "66165ff3ab257b1970743baf", "Coupe de la Ligue - Italy"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Jersey }, "Jersey", "661660dddd00108cc083cb82", "Coupe de la Ligue - Jersey"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Latvia }, "Latvia", "6616610aab257b1970743da1", "Coupe de la Ligue - Latvia"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Liechtenstein }, "Liechtenstein", "67dd57897a18c0e220d3fdc5", "Coupe de la Ligue - Liechtenstein"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Lithuania }, "Lithuania", "6616626add00108cc083cd72", "Coupe de la Ligue - Lithuania"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Luxembourg }, "Luxembourg", "66166465dd00108cc083cfa9", "Coupe de la Ligue - Luxembourg"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Malta }, "Malta", "66166519ed5d1147573f77a3", "Coupe de la Ligue - Malta"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Monaco }, "Monaco", "6616656de248f096ec9b9090", "Coupe de la Ligue - Monaco"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Montenegro }, "Montenegro", "6616659e4e2a0b9d8db9c3fa", "Coupe de la Ligue - Montenegro"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Netherlands }, "Netherlands", "661667ecdd00108cc083d556", "Coupe de la Ligue - Netherlands"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.North_Macedonia }, "North Macedonia", "661664a8e248f096ec9b8f7f", "Coupe de la Ligue - North Macedonia"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Norway }, "Norway", "6616663ef31375669b01b413", "Coupe de la Ligue - Norway"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Poland }, "Poland", "661673dfcf3ea74960e4a21f", "Coupe de la Ligue - Poland"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Portugal }, "Portugal", "66167529fb19f1fdea2bffcd", "Coupe de la Ligue - Portugal"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Romania }, "Romania", "66167630a81e8da8b719963e", "Coupe de la Ligue - Romania"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.San_Marino }, "San Marino", "661678a7a81e8da8b7199b53", "Coupe de la Ligue - San Marino"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Serbia }, "Serbia", "661678dedd00108cc083f671", "Coupe de la Ligue - Serbia"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Slovakia }, "Slovakia", "66167a803b6ff9c413d9a6f2", "Coupe de la Ligue - Slovakia"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Slovenia }, "Slovenia", "66167ae5dd00108cc083fafb", "Coupe de la Ligue - Slovenia"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Spain }, "Spain", "6616578eab257b1970742ebb", "Coupe de la Ligue - Spain"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Sweden }, "Sweden", "66167b21ed5d1147573fa760", "Coupe de la Ligue - Sweden"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Switzerland }, "Switzerland", "66167ce9a81e8da8b719a373", "Coupe de la Ligue - Switzerland"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Turkiye }, "Türkiye", "661641a0ed5d1147573f3aa2", "Coupe de la Ligue - Turkiye"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.Ukraine }, "Ukraine", "66167f194e2a0b9d8db9f8a5", "Coupe de la Ligue - Ukraine"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Europe, countryNumber: EuropeCountryNumber.United_Kingdom }, "United Kingdom", "6616779de248f096ec9bb2af", "Coupe de la Ligue - United Kingdom"),
    
    // Asia Maps
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.Bangladesh }, "Bangladesh", "66163019ed5d1147573f2256", "Coupe de la Ligue - Bangladesh"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.Bhutan }, "Bhutan", "6616308b9d295bf4901bbc3e", "Coupe de la Ligue - Bhutan"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.Cambodia }, "Cambodia", "661630d6d61e067ae0967f05", "Coupe de la Ligue - Cambodia"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.Christmas_Island }, "Christmas & Cocos Island", "661682be3b6ff9c413d9b88a", "Coupe de la Ligue - Christmas & Cocos Island"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.Cyprus }, "Cyprus", "6909d478125332b237188b75", "Coupe de la Ligue - Cyprus"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.Georgia }, "Georgia", "6a6de76aee36e8e7c7e95afb", "Coupe de la Ligue - Georgia"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.Hong_Kong }, "Hong Kong", "661632d2f31375669b015990", "Coupe de la Ligue - Hong Kong"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.India }, "India", "6616333b4e2a0b9d8db96d37", "Coupe de la Ligue - India"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.Indonesia }, "Indonesia", "661633af962c0880ae036028", "Coupe de la Ligue - Indonesia"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.Israel }, "Palestine & Israel", "6616353ed61e067ae09683c2", "Coupe de la Ligue - Palestine & Israel"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.Japan }, "Japan", "6616359e962c0880ae0362ac", "Coupe de la Ligue - Japan"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.Jordan }, "Jordan", "661637183b756b98bd1281e1", "Coupe de la Ligue - Jordan"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.Kazakhstan }, "Kazakhstan", "66164225f31375669b0170d1", "Coupe de la Ligue - Kazakhstan"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.Kyrgyzstan }, "Kyrgyzstan", "6616378d3b6ff9c413d92ec7", "Coupe de la Ligue - Kyrgyzstan"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.Laos }, "Laos", "661638289d295bf4901bc41d", "Coupe de la Ligue - Laos"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.Macao }, "Macau", "6616386cab257b197073f3eb", "Coupe de la Ligue - Macau"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.Malaysia }, "Malaysia", "661638c04e2a0b9d8db9747e", "Coupe de la Ligue - Malaysia"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.Mongolia }, "Mongolia", "6616392fed5d1147573f2c01", "Coupe de la Ligue - Mongolia"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.Nepal }, "Nepal", "6909dda0467f13a8ab1abddd", "Coupe de la Ligue - Nepal"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.Oman }, "Oman", "67dd3c1aab5240b32f8c5686", "Coupe de la Ligue - Oman"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.Philippines }, "Philippines", "66163980962c0880ae036768", "Coupe de la Ligue - Philippines"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.Qatar }, "Qatar", "661639e73b756b98bd128581", "Coupe de la Ligue - Qatar"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.Russia }, "Russia", "66163a4e962c0880ae036813", "Coupe de la Ligue - Russia"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.Singapore }, "Singapore", "66163d303b756b98bd128b11", "Coupe de la Ligue - Singapore"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.South_Korea }, "South Korea", "6616313abe08f9b164ba399e", "Coupe de la Ligue - South Korea"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.Sri_Lanka }, "Sri Lanka", "66163d79be08f9b164ba4917", "Coupe de la Ligue - Sri Lanka"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.Taiwan }, "Taiwan", "66163e9a4e2a0b9d8db98004", "Coupe de la Ligue - Taiwan"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.Thailand }, "Thailand", "661640d3962c0880ae037502", "Coupe de la Ligue - Thailand"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.United_Arab_Emirates }, "United Arab Emirates", "661632719d295bf4901bbe20", "Coupe de la Ligue - United Arab Emirates"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Asia, countryNumber: AsiaCountryNumber.Vietnam }, "Vietnam", "6909de20410b82f85dbcc221", "Coupe de la Ligue - Vietnam"),
    
    // Africa maps
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Africa, countryNumber: AfricaCountryNumber.Botswana }, "Botswana", "661533b6cb7a74b2aeed417e", "Coupe de la Ligue - Botswana"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Africa, countryNumber: AfricaCountryNumber.Eswatini }, "Eswatini", "66153434071c5a707f146ff8", "Coupe de la Ligue - Eswatini"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Africa, countryNumber: AfricaCountryNumber.Ghana }, "Ghana", "661535730f380279cbea37de", "Coupe de la Ligue - Ghana"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Africa, countryNumber: AfricaCountryNumber.Kenya }, "Kenya", "6615360b2a4985369387fd7a", "Coupe de la Ligue - Kenya"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Africa, countryNumber: AfricaCountryNumber.Lesotho }, "Lesotho", "66153671cc0e612ad6c27bec", "Coupe de la Ligue - Lesotho"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Africa, countryNumber: AfricaCountryNumber.Namibia }, "Namibia", "6909d41ef14c4e0891fd77c2", "Coupe de la Ligue - Namibia"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Africa, countryNumber: AfricaCountryNumber.Nigeria }, "Nigeria", "661536d65e5559cce0abde86", "Coupe de la Ligue - Nigeria"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Africa, countryNumber: AfricaCountryNumber.Rwanda }, "Rwanda", "66153789de5672bc8243023a", "Coupe de la Ligue - Rwanda"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Africa, countryNumber: AfricaCountryNumber.Sao_Tome_and_Principe }, "Sao Tomé and Principe", "661538e1aa02ca5405c00228", "Coupe de la Ligue - Sao Tomé and Principe"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Africa, countryNumber: AfricaCountryNumber.Senegal }, "Senegal", "661537d70f380279cbea3c2f", "Coupe de la Ligue - Senegal"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Africa, countryNumber: AfricaCountryNumber.South_Africa }, "South Africa", "661530dd0f380279cbea2f36", "Coupe de la Ligue - South Africa"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Africa, countryNumber: AfricaCountryNumber.Tunisia }, "Tunisia", "661538432a498536938801b6", "Coupe de la Ligue - Tunisia"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Africa, countryNumber: AfricaCountryNumber.Uganda }, "Uganda", "6615373f86035ff82acf36a4", "Coupe de la Ligue - Uganda"),
    
    // North America maps
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.North_America, countryNumber: NorthAmericaCountryNumber.Canada }, "Canada", "66153975b615e1179ac2c953", "Coupe de la Ligue - Canada"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.North_America, countryNumber: NorthAmericaCountryNumber.Costa_Rica }, "Costa Rica", "690c54193a5a909e429c4920", "Coupe de la Ligue - Costa Rica"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.North_America, countryNumber: NorthAmericaCountryNumber.Curacao }, "Curacao", "66153a741319bdc2faef7351", "Coupe de la Ligue - Curacao"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.North_America, countryNumber: NorthAmericaCountryNumber.Dominican_Republic }, "Dominican Republic", "66153e28817f5c424932ce5a", "Coupe de la Ligue - Dominican Republic"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.North_America, countryNumber: NorthAmericaCountryNumber.Guatemala }, "Guatemala", "66153b4d9540c2647745d377", "Coupe de la Ligue - Guatemala"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.North_America, countryNumber: NorthAmericaCountryNumber.Mexico }, "Mexico", "66153c82b63d5c03c1edb560", "Coupe de la Ligue - Mexico"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.North_America, countryNumber: NorthAmericaCountryNumber.Panama }, "Panama", "661540c3571cd7b57987330c", "Coupe de la Ligue - Panama"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.North_America, countryNumber: NorthAmericaCountryNumber.Puerto_Rico }, "Puerto Rico", "66153dd7f727ae23d55002b9", "Coupe de la Ligue - Puerto Rico"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.North_America, countryNumber: NorthAmericaCountryNumber.United_States }, "USA", "66153e71ee6a46d2f47df5d9", "Coupe de la Ligue - United States of America"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.North_America, countryNumber: NorthAmericaCountryNumber.United_States_Virgin_Islands }, "US Virgin Islands", "66153c2ab63d5c03c1edb4ba", "Coupe de la Ligue - US Virgin Islands"),
    
    // South America maps
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.South_America, countryNumber: SouthAmericaCountryNumber.Argentina }, "Argentina", "66154110d6168e5311f5f757", "Coupe de la Ligue - Argentina"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.South_America, countryNumber: SouthAmericaCountryNumber.Bolivia }, "Bolivia", "661542d21319bdc2faef8393", "Coupe de la Ligue - Bolivia"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.South_America, countryNumber: SouthAmericaCountryNumber.Brazil }, "Brazil", "661543be6b1af9d13d18e546", "Coupe de la Ligue - Brazil"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.South_America, countryNumber: SouthAmericaCountryNumber.Chile }, "Chile", "661544e1fe45e9b41eecf738", "Coupe de la Ligue - Chile"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.South_America, countryNumber: SouthAmericaCountryNumber.Colombia }, "Colombia", "661545cec64f4e97b5e63e04", "Coupe de la Ligue - Colombia"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.South_America, countryNumber: SouthAmericaCountryNumber.Ecuador }, "Ecuador", "66154704d968cc074b7f5b29", "Coupe de la Ligue - Ecuador"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.South_America, countryNumber: SouthAmericaCountryNumber.Paraguay }, "Paraguay", "69255b0d4678bf1c66c0e542", "Coupe de la Ligue - Paraguay"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.South_America, countryNumber: SouthAmericaCountryNumber.Peru }, "Peru", "661547f35d4f8d1b4a97d8db", "Coupe de la Ligue - Peru"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.South_America, countryNumber: SouthAmericaCountryNumber.Uruguay }, "Uruguay", "661549021319bdc2faef8d05", "Coupe de la Ligue - Uruguay"),
    
    // Oceania maps
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Oceania, countryNumber: OceaniaCountryNumber.American_Samoa }, "American Samoa", "6616835cf31375669b01f01d", "Coupe de la Ligue - American Samoa"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Oceania, countryNumber: OceaniaCountryNumber.Australia }, "Australia", "661680bd962c0880ae03ebe7", "Coupe de la Ligue - Australia"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Oceania, countryNumber: OceaniaCountryNumber.Guam }, "Guam", "6616828ebe08f9b164bad492", "Coupe de la Ligue - Guam"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Oceania, countryNumber: OceaniaCountryNumber.New_Zealand }, "New Zealand", "66168171ab257b1970747cc6", "Coupe de la Ligue - New Zealand"),
    new AreaMap({ kind: "country", continentNumber: ContinentNumber.Oceania, countryNumber: OceaniaCountryNumber.Northern_Mariana_Islands }, "Northern Mariana Islands", "661682eced5d1147573fb788", "Coupe de la Ligue - Northern Mariana Islands"),
)


export const mapsConfig: AreaMap[] = allMaps
