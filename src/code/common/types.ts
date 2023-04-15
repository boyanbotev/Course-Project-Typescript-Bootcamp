// TODO: Add d.ts file for types
import { Texture } from "pixi.js";

export type SlotSymbol = "axe" | "B" | "C" | "emerald" | "H" | "horns" | "king" | "P" | "princess" | "square" | "T" | "warrior" | "X" | "jem" | "dagger" | "и" | "я";

export type SlotSymbolMap = {
    [key: number]: SlotSymbol;
}

export type Response = UpdateResponse | InitResponse | ErrorResponse;

export type UpdateResponse = {
    "action": "update",
    "spin-result": {
        "reelIndexes": number[],
        "win": number,
    },
    "balance": number,
}

export type ErrorResponse = {
    "action": "error",
    "error": string,
}

export type InitResponse = {
    "action": "init",
    "symbols": number[][],
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

export enum ReelState {
    Idle,
    Spinning, // randomly assigning symbols
    Stopping, // preparing symbols specified by backend
}

export enum SymbolState {
    Idle,
    Spinning,
    PreparingToStop,
    Stopping
}

export enum SlotMachineState {
    Idle,
    Spinning,
}

export type SymbolBundle = {
    [key: string]: Texture;
}