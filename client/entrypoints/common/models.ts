import { type Client } from "archipelago.js";

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

export class GACGameState {
    maps: GACMap[];
    globalGamemode: GACGamemode;
    globalTimerSeconds: number;

    constructor(maps: GACMap[], globalGamemode: GACGamemode, globalTimerSeconds: number) {
        this.maps = maps
        this.globalGamemode = globalGamemode
        this.globalTimerSeconds = globalTimerSeconds
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

export enum MessageType {
    Default,
    ServerConnect,
    ServerDisconnect,
    RetrieveGameState,
    RetrieveConnectionStatus,
    GenerateGame,
    RoundFinished,
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

export class RetrieveConnectionStatusMessage {
    type: MessageType = MessageType.RetrieveConnectionStatus;

    constructor() { }
}

export class RetrieveGameStateMessage {
    type: MessageType = MessageType.RetrieveGameState;

    constructor() { }
}

export class GenerateGameMessage {
    type: MessageType = MessageType.GenerateGame;
    mapId: string

    constructor(mapId: string) {
        this.mapId = mapId
    }
}

export class RoundFinishedMessage {
    type: MessageType = MessageType.RoundFinished;
    gameStatus: GeoguessrGameStatus;
    gameId: string;
    mapId: string;
    mapName: string;
    roundScore: number;
    totalScore: number;

    constructor(gameStatus: GeoguessrGameStatus, gameId: string, mapId: string, mapName: string, roundScore: number, totalScore: number) {
        this.gameStatus = gameStatus
        this.gameId = gameId
        this.mapId = mapId
        this.mapName = mapName
        this.roundScore = roundScore
        this.totalScore = totalScore
    }
}

export enum GeoguessrGameStatus {
    STARTED = "started",
    FINISHED = "finished"
}

export class GeoguessrRoundFinishedMessage {
    type: MessageType = MessageType.GeoguessrGameFinished
    token?: string;
    state?: GeoguessrGameStatus;
    mapId?: string;
    mapName?: string;
    roundScore?: number;
    totalScore?: number;
    playerId?: string;

    constructor(data: any) {
        this.token = data["token"]
        this.state = data["state"] as GeoguessrGameStatus
        this.mapId = data["map"]
        this.mapName = data["mapName"]
        const guesses: any[] = data["player"]["guesses"]
        this.roundScore = guesses[guesses.length - 1]["roundScoreInPoints"]
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

export enum StatusSpecialMode {
    None,
    Loading,
    Failed
}