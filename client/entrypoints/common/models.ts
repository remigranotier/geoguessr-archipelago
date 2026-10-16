import type { AreaLocations } from "./config/area-map";
import { defaultMedalThresholds, GACMedal } from "./config/medals";
import { apClient } from "../background";

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

export enum FillerItemId {
    SpecialTip = 10000,
    QuestionableTip = 10001,
}

export class GACProgression {
    constructor(
        public gameType: GACGameType = GACGameType.Game,
        public bestScore: number = 0,
        public bestSeed: string = "",
        public fivekDone: boolean = false,
    ) { }
}

export class GACMap {
    constructor(
        public id: string = "defaultId",
        public name: string = "defaultName",
        public progression: GACProgression = new GACProgression(),
        public unlocked: boolean = false,
        public gamemode: GACGamemode = GACGamemode.None,
        public visible: boolean = false,
        public playable: boolean = false,
        public locationsMissing: Set<AreaLocations> = new Set(),
        public medalThresholds: Record<GACMedal, number> = defaultMedalThresholds
    ) { }
}

export class GACGameState {
    maps: GACMap[];
    url: string;
    gameFinished: boolean;
    configData: Record<string, unknown>;

    constructor(maps: GACMap[]) {
        this.maps = maps
        this.url = apClient.socket.url
        this.gameFinished = false;
        this.configData = globalThis.gameConfigData
    }
}

export class GACConnectionStatus {
    authenticated: boolean;
    player: string;
    server: string;
    seed: string;

    constructor() {
        this.authenticated = apClient.authenticated
        this.player = apClient.name
        this.server = apClient.socket.url
        this.seed = apClient.room.seedName
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