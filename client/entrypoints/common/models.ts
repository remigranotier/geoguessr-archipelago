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