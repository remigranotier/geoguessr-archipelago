import { PlayerOptions } from "./main";

export const presetMap: Map<string, PlayerOptions> = new Map()

export function initPresets() {
    presetMap.set("default", new PlayerOptions(
        50,
        "full",
        "medals_count",
        20,
        1,
        5,
        1,
        "hard",
        true,
        100,
        false,
    ))
    presetMap.set("beginner", new PlayerOptions(
        50,
        "full",
        "medals_count",
        15,
        1,
        5,
        2,
        "easy",
        false,
        75,
        false,
    ))
    presetMap.set("pinpointer", new PlayerOptions(
        50,
        "full",
        "plat_count",
        1,
        5,
        5,
        1,
        "medium",
        true,
        100,
        false,
    ))
    presetMap.set("nm_player", new PlayerOptions(
        50,
        "full",
        "medals_count",
        30,
        1,
        10,
        2,
        "medium",
        false,
        100,
        false,
    ))
    presetMap.set("blinky", new PlayerOptions(
        50,
        "full",
        "plat_count",
        1,
        10,
        10,
        1,
        "hard",
        true,
        100,
        false,
    ))
    presetMap.set("mk", new PlayerOptions(
        50,
        "full",
        "medals_count",
        40,
        1,
        13,
        1,
        "hard",
        false,
        100,
        false,
    ))
    presetMap.set("full_explorer", new PlayerOptions(
        50,
        "full",
        "plat_count",
        1,
        119,
        112,
        22,
        "hard",
        true,
        100,
        false,
    ))
}
