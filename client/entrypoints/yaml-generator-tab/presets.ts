import { PlayerOptions } from "./main";

export const presetMap: Map<string, PlayerOptions> = new Map()
presetMap.set("default", new PlayerOptions(
    50,
    "full",
    "medals_count",
    20,
    1,
    10,
    3,
    "hard",
    true
))
presetMap.set("beginner", new PlayerOptions(
    50,
    "full",
    "medals_count",
    15,
    1,
    10,
    3,
    "easy",
    false
))
presetMap.set("pinpointer", new PlayerOptions(
    50,
    "full",
    "plat_count",
    1,
    5,
    10,
    3,
    "medium",
    true
))
presetMap.set("nm_player", new PlayerOptions(
    50,
    "full",
    "medals_count",
    30,
    1,
    15,
    3,
    "medium",
    false
))
presetMap.set("blinky", new PlayerOptions(
    50,
    "full",
    "plat_count",
    1,
    10,
    20,
    3,
    "hard",
    true
))
presetMap.set("mk", new PlayerOptions(
    50,
    "full",
    "medals_count",
    40,
    1,
    20,
    3,
    "hard",
    false
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
    true
))