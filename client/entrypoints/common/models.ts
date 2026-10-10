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
    id: string = "defaultId";
    gameType: GACGameType = GACGameType.Game
    name: string = "defaultName";
    available: boolean = false;
    bestMedal: GACMedal = GACMedal.None
    fivekDone: boolean = false;
    mapDone: boolean = false;
    bestScore: number = 0;
    bestSeed: string = "";
    gamemode: GACGamemode = GACGamemode.None;
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