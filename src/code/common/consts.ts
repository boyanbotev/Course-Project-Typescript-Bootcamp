import { SlotSymbolMap, WinMap } from "./types";

// For debugging
export const slotSymbolMap: SlotSymbolMap = {
    1: "princess",
    2: "warrior",
    3: "и",
    4: "jem",
    5: "axe",
    6: "P",
    7: "horns",
    8: "я",
    9: "T",
    10: "X",
    11: "C",
    12: "king",
    13: "H",
    14: "emerald",
    15: "dagger",
    16: "square",
    17: "B",
}

export const winMultiplierMap: WinMap = {
    1: 20,      // princess
    2: 7,      // warrior
    3: 5,       // и
    4: 12,      // jem
    5: 6,       // axe
    6: 2,       // P
    7: 8,      // horns
    8: 3,       // я
    9: 2,       // T
    10: 2,      // X
    11: 2,      // C
    12: 20,     // king
    13: 2,      // H
    14: 14,     // emerald
    15: 9,      // dagger
    16: 6,      // square
    17: 2,      // B
}

export const testReels = [
    [1, 2, 2, 2, 1, 2, 6, 1, 6, 2, 1, 6, 2, 7, 6, 1, 7, 1, 2, 2],
    [1, 1, 6, 2, 2, 6, 6, 6, 1, 7, 6, 1, 1, 6, 1, 2, 2, 6, 2, 7],
    [7, 1, 6, 2, 6, 2, 7, 6, 2, 2, 6, 1, 2, 2, 6, 6, 1, 1, 6, 1],
    [10, 11, 12, 13, 14, 15, 16, 17, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
]
