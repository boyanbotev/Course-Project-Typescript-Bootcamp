// TODO: Add d.ts file for types
import { Texture, DisplayObject } from "pixi.js";

export type SlotSymbol = "axe" | "B" | "C" | "emerald" | "H" | "horns" | "king" | "P" | "princess" | "square" | "T" | "warrior" | "X" | "jem" | "dagger" | "и" | "я";

export type SlotSymbolMap = {
    [key: number]: SlotSymbol;
}

export type WinMap = {
    [key: number]: number;
}

export type Response = UpdateResponse | InitResponse | ErrorResponse;

export type UpdateResponse = {
    "action": "update",
    "spin-result": {
        "win"?: number,
        "symbols": SymbolReference[][],
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
    Idle = "Idle",
    Spinning = "Spinning", // randomly assigning symbols
    Stopping = "Stopping", // preparing symbols specified by backend
}

export enum SymbolState {
    Idle = "Idle",
    Spinning = "Spinning",
    PreparingToStop = "PreparingToStop",
    Stopping = "Stopping",
    Animating = "Animating",
}

export enum SlotMachineState {
    Idle = "Idle",
    Spinning = "Spinning",
}

export type SymbolBundle = {
    [key: string]: Texture;
}

export type CheckReelResult = {
    count: number,
    symbolIndex: number[],
};

export type WinResult = {
    totalCount: number,
    symbolRefs: SymbolReference[][],
};

export type SymbolReference = {
    symbolId: number;
    winningLineIndex: number | undefined;
}

export interface Scene extends DisplayObject {
    update(delta: number): void;
}

export interface SlotMachineObserver {
    onSpin(): void;
    onSpinComplete(): void;
    onWin(win: number): void;
    onBalanceUpdate(balance: number): void;
}

export type UpdateAction = "spin" | "stop" | "win" | "balanceUpdate" | "init";
