import { type Client } from "archipelago.js";
import type { AreaLocations } from "./config/area-map";
import { defaultMedalThresholds, GACMedal } from "./config/medals";

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

    public getMedalAmount() {
        return Object.entries(this.medalThresholds)
            .filter(([medal, threshold]) => medal != GACMedal.None.toString() && this.progression.bestScore >= threshold)
            .length
    }

    public getBestMedal() {
        const score = this.progression.bestScore
        switch (true) {
            case score < this.medalThresholds[GACMedal.Bronze]:
                return GACMedal.None
            case score < this.medalThresholds[GACMedal.Silver]:
                return GACMedal.Bronze
            case score < this.medalThresholds[GACMedal.Gold]:
                return GACMedal.Silver
            case score < this.medalThresholds[GACMedal.Platinum]:
                return GACMedal.Gold
            default:
                return GACMedal.Platinum
        }
    }
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