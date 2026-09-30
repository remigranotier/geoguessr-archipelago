import type { GACGameState, GeoguessrGameStatus } from "./models";

export enum MessageType {
    Default = "Default",
    ServerConnect = "ServerConnect",
    ServerDisconnect = "ServerDisconnect",
    RetrieveGameState = "RetrieveGameState",
    SendGameState = "SendGameState",
    RetrieveConnectionStatus = "RetrieveConnectionStatus",
    GenerateGame = "GenerateGame",
    RoundFinished = "RoundFinished",
    GeoguessrGameFinished = "GeoguessrGameFinished",
}

export class ServerConnectMessage {
    type: MessageType = MessageType.ServerConnect;
    serverUrl: string = "";
    slotName: string = "";
    password: string = "";

    constructor(serverUrl: string, slotName: string, password: string) {
        this.serverUrl = serverUrl
        this.slotName = slotName
        this.password = password
    }
}

export class ServerDisconnectMessage {
    type: MessageType = MessageType.ServerDisconnect;

    constructor() { }
}

export class RetrieveConnectionStatusMessage {
    type: MessageType = MessageType.RetrieveConnectionStatus;

    constructor() { }
}

export class RetrieveGameStateMessage {
    type: MessageType = MessageType.RetrieveGameState;

    constructor() { }
}

export class SendGameStateMessage {
    type: MessageType = MessageType.SendGameState;

    constructor(
        public gameState: GACGameState
    ) { }
}

export class GenerateGameMessage {
    type: MessageType = MessageType.GenerateGame;

    constructor(
        public mapId: string
    ) { }
}

export class RoundFinishedMessage {
    type: MessageType = MessageType.RoundFinished;

    constructor(
        public gameStatus: GeoguessrGameStatus,
        public gameId: string,
        public mapId: string,
        public mapName: string,
        public roundScore: number,
        public totalScore: number,
    ) { }
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