export const DEFAULT_SERVER = "archipelago.gg:XXXXX"
export const DEFAULT_SLOT_NAME = "playerName"

export enum GACGamemode {
    None = 0,
    Move = 1 << 0,
    Pan = 1 << 1,
    Zoom = 1 << 2
}

export class GACMap {
    id: string = "defaultId";
    name: string = "defaultName";
    available: boolean = false;
    bestScore: number = 0;
    timer?: number;
    gamemode?: GACGamemode;
}

export enum MessageType {
    Default,
    ServerConnect,
    ServerDisconnect,
    GameFinished,
    GeoguessrGameFinished
}

export class ServerConnectMessage {
    type: MessageType = MessageType.ServerConnect;
    serverUrl: string = DEFAULT_SERVER;
    slotName: string = DEFAULT_SLOT_NAME;

    constructor(serverUrl: string, slotName: string) {
        this.serverUrl = serverUrl
        this.slotName = slotName
    }
}

export class GameFinishedMessage {
    type: MessageType = MessageType.GameFinished;
    gameId?: string;
    mapId?: string;
    mapName?: string;
    score: number = 0;

    constructor(gameId: string, mapId: string, mapName: string, score: number) {
        this.gameId = gameId
        this.mapId = mapId
        this.mapName = mapName
        this.score = score
    }
}

export enum GeoguessrGameStatus {
    STARTED = "started",
    FINISHED = "finished"
}

export class GeoguessrGameFinishedMessage {
    type: MessageType = MessageType.GeoguessrGameFinished
    token?: string;
    state?: GeoguessrGameStatus;
    mapId?: string;
    mapName?: string;
    totalScore?: number;
    playerId?: string;

    constructor(data: any) {
        this.token = data["token"]
        this.state = data["state"] as GeoguessrGameStatus
        this.mapId = data["map"]
        this.mapName = data["mapName"]
        this.totalScore = data["player"]["totalScoreInPoints"]
        this.playerId = data["player"]["id"]
    }
}

export interface GACMessage {
    type: MessageType;
}

export interface GACResponse {
    success: boolean;
    data?: any;
    error?: string;
}

export type SlotData = {
    whatever: string;
}