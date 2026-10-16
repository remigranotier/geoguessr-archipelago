import { GACGamemode, type GACGameType, type GeoguessrGameStatus, type SoundEffectType } from "./models";
import { gamemodeFromData } from "./utils";

export enum MessageType {
    KeepAlive = "KeepAlive",
    ServerConnect = "ServerConnect",
    ServerDisconnect = "ServerDisconnect",
    RetrieveConnectionStatus = "RetrieveConnectionStatus",
    GenerateGame = "GenerateGame",
    RoundFinished = "RoundFinished",
    GeoguessrGameFinished = "GeoguessrGameFinished",
    RetrieveLogs = "RetrieveLogs",
    SendNewLog = "SendNewLog",
    SendSoundEffect = "SendSoundEffect",
    SubmitManualId = "SubmitManualId",
    DataConflict = "DataConflict"
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
}

export class RetrieveConnectionStatusMessage {
    type: MessageType = MessageType.RetrieveConnectionStatus;
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
        public gameType: GACGameType,
        public gamemode: GACGamemode,
        public mapId: string,
        public mapName: string,
        public roundScore: number,
        public roundCount: number,
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
    roundCount?: number;
    totalScore?: number;
    playerId?: string;
    gamemode?: GACGamemode;

    constructor(data: any) {
        this.token = data["token"]
        this.state = data["state"] as GeoguessrGameStatus
        this.mapId = data["map"]
        this.mapName = data["mapName"]
        const guesses: any[] = data["player"]["guesses"]
        this.roundScore = guesses.at(-1)["roundScoreInPoints"]
        this.roundCount = data["roundCount"]
        this.totalScore = data["player"]["totalScoreInPoints"]
        this.playerId = data["player"]["id"]
        this.gamemode = gamemodeFromData(data)
    }
}

export class RetrieveLogsMessage {
    type: MessageType = MessageType.RetrieveLogs;
}

export class SendNewLogMessage {
    type: MessageType = MessageType.SendNewLog;

    constructor(
        public htmlContent: string
    ) { }
}
export class SendSoundEffectMessage {
    type: MessageType = MessageType.SendSoundEffect;

    constructor(
        public soundType: SoundEffectType
    ) { }
}

export class SubmitManualIdMessage {
    type: MessageType = MessageType.SubmitManualId;

    constructor(public id: string) { }
}

export class DataConflictMessage {
    type: MessageType = MessageType.DataConflict

    constructor(public usePreviousData: boolean) { }
}

export class KeepAliveMessage {
    type: MessageType = MessageType.KeepAlive
}


export interface GACMessage {
    type: MessageType;
}