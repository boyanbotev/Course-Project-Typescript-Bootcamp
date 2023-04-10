// TODO: Add d.ts file for types

export type SlotSymbol = "axe" | "B" | "C" | "emerald" | "H" | "horns" | "king" | "P" | "princess" | "square" | "T" | "warrior" | "X" | "jem" | "dagger" | "и" | "я";

export type Response = UpdateResponse | InitResponse | ErrorResponse;

type UpdateResponse = {
    "action": "update",
    "spin-result": {
        "reelIndexes": number[],
        "win": number,
    },
    "balance": number,
}

type ErrorResponse = {
    "action": "error",
    "error": string,
}

type InitResponse = {
    "action": "init",
    "symbols": SlotSymbol[][],
    "balance": number,
}

export type Request = InitRequest | SpinRequest;

type SpinRequest = {
    "action": "spin",
    "bet": number,
}

type InitRequest = {
    "action": "init",
}