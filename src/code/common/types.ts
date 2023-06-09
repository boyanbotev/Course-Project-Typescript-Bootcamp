import { Texture, DisplayObject, Resource } from "pixi.js";

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
}

export enum SlotMachineState {
    Idle = "Idle",
    Spinning = "Spinning",
}

export type SymbolBundle = {
    [key: string]: Texture;
}

export type ParticleBundle = {
    particle: Texture;
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

export enum UpdateAction {
    Spin = "spin",
    Stop ="stop",
    Win = "win",
    BalanceUpdate = "balanceUpdate",
    Error = "error",
};
export type UpdateData = string | number;

export interface UIObserver {
    onSpin(): void;
    onBetChange(bet: number): void;
}

export enum UIAction {
    Spin = "spin",
    BetChange = "betChange",
};
export type UIData = number;

export interface SlotMachine {
    spin(): Promise<void>;
    checkIfReelsStopped(): void;
    addObserver(observer: SlotMachineObserver): void;
    removeObserver(observer: SlotMachineObserver): void;
    notifyObservers(action: UpdateAction, data?: UpdateData): void;
    updateReels(delta: number): void;
    get State(): SlotMachineState;
    onSpin(): void;
    onBetChange(bet: number): void;
    fadeIn(duration: number): void;
}

export interface Reel {
    updateSymbols(delta: number): void;
    highlightWinningSymbols(paylineLength: number): void;
    spin(finalSymbols: SymbolReference[]): void;
    getRandomTexture(): Texture;
    incrementSymbolIndex(): number;
    get FinalSymbol(): Texture;
    get ReelLength(): number;
}

export interface Symbol {
    update(delta: number): void;
    initializePulse(payline: number, paylineLength: number): void;
    darken(): void;
    reset(): void;
    set Velocity(velocity: number);
    get State(): SymbolState;
    set State(state: SymbolState);
    get SymbolIndex(): number;
    set SymbolIndex(index: number);
}

export type ButtonOptions = {
    texture?: Texture<Resource>,
    hoverTexture?: Texture<Resource>,
    scale?: number,
    text?: string,
}
