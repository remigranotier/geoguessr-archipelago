import { type Client } from "archipelago.js";

export enum GACGamemode {
    None = 0,
    Move = 1,
    Pan = 2,
    Zoom = 4
}

export enum GACGameType {
    Game = 0,
    Challenge = 1,
}

export enum GACMedal {
    None = 0,
    Bronze = 1,
    Silver = 2,
    Gold = 3,
    Platinum = 4
}

export enum FillerItemId {
    SpecialTip = 10000,
    QuestionableTip = 10001,
}

export class GACMap {
    constructor(
        public id: string = "defaultId",
        public name: string = "defaultName",
        public gameType: GACGameType = GACGameType.Game,
        public unlocked: boolean = false,
        public visible: boolean = false,
        public playable: boolean = false,
        public bestMedal: GACMedal = GACMedal.None,
        public fivekDone: boolean = false,
        public mapDone: boolean = false,
        public bestScore: number = 0,
        public bestSeed: string = "",
        public gamemode: GACGamemode = GACGamemode.None,
    ) { }
}

export class GACGameState {
    maps: GACMap[];

    constructor(maps: GACMap[]) {
        this.maps = maps
    }
}

export class GACConnectionStatus {
    authenticated: boolean;
    player: string;
    server: string;

    constructor(client: Client) {
        this.authenticated = client.authenticated
        this.player = client.name
        this.server = client.socket.url
    }
}

export enum GeoguessrGameStatus {
    STARTED = "started",
    FINISHED = "finished"
}

export interface GACResponse {
    success: boolean;
    data?: any;
    error?: string;
}

export type SlotData = {
    whatever: string;
}

export enum StatusSpecialMode {
    None,
    Loading,
    Failed
}

export enum SoundEffectType {
    None,
    LocationChecked,
    ItemReceived,
    GoalReached
}