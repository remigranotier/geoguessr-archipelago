export enum Gamemode {
    None = 0,
    Move = 1 << 0,
    Pan = 1 << 1,
    Zoom = 1 << 2
}

export class Map {
    id: string = "defaultId";
    name: string = "defaultName";
    available: boolean = false;
    bestScore: number = 0;
    timer?: number;
    gamemode?: Gamemode;
}