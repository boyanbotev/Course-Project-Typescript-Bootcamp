import { Container, Texture } from "pixi.js";
import { Symbol } from "./Symbol";
import { SymbolBundle } from "../common/types";
import { ReelState, SymbolState } from "../common/types";
import { slotSymbolMap } from "../common/consts";

export class Reel extends Container {
    private reelLength: number;
    private symbolSize: number;
    private reelXIndex: number;

    private reels: number[][];
    private symbolsBundle: SymbolBundle;
    private symbols: Symbol[] = [];

    private velocity: number = 0;
    private decreaseRate: number = 0.1;
    private velocityThreshold: number = 15;

    private currentState: ReelState = ReelState.Idle;
    private symbolIndex: number = 0;

    private finalSymbols: number[] = [];

    constructor(
        reelXpos: number,
        addedReelLength: number,
        symbolSize: number,
        symbolsBundle: SymbolBundle,
        symbolReferenceOrder: number[][],
        parent: Container
    ) {
        super();
        this.reelXIndex = reelXpos;
        this.reelLength = addedReelLength;
        this.symbolSize = symbolSize;
        this.symbolsBundle = symbolsBundle;
        this.reels = symbolReferenceOrder;

        parent.addChild(this);
        this.createSymbols();
    }

    public createSymbols(): void {
        for (let j = 0; j < this.reelLength; j++) {
            const symbol = new Symbol(this.symbolSize, (this.symbolSize * this.reelLength), this);
            symbol.texture = this.symbolsBundle[this.reels[this.reelXIndex][j]];
            symbol.x = this.symbolSize * this.reelXIndex;
            symbol.y = this.symbolSize * j + this.symbolSize;
            symbol.width = this.symbolSize;
            symbol.height = this.symbolSize;

            this.addChild(symbol);
            this.symbols.push(symbol);
        }
    }

    public updateSymbols(delta: number): void {
        switch (this.currentState) {
            case ReelState.Idle:
                break;
            case ReelState.Spinning:
                this.velocity -= this.decreaseRate;

                this.symbols.forEach((symbol) => {
                    symbol.update(delta);
                    symbol.Velocity = this.velocity;
                });

                if (this.velocity < this.velocityThreshold) {          
                    this.beginStopping();
                }  
                break;
            case ReelState.Stopping:
                this.symbols.forEach((symbol) => {
                    symbol.update(delta);
                });
    
                const stopped = this.areSymbolsStopped();

                if (stopped) {
                    this.currentState = ReelState.Idle;
                }
                break;
        }   
    }

    private beginStopping() {
        this.currentState = ReelState.Stopping;

        this.symbols.forEach((symbol) => {
            symbol.State = SymbolState.PreparingToStop;
        });
    }

    private areSymbolsStopped(): boolean {
        let isAllStopped = true;
        this.symbols.forEach((symbol) => {
            if (symbol.State !== SymbolState.Idle) {
                isAllStopped = false;
            }
        });
        return isAllStopped;
    }

    public getRandomTexture(): Texture {
        const randomIndex = Math.floor(Math.random() * this.reels[this.reelXIndex].length);
        return this.symbolsBundle[this.reels[this.reelXIndex][randomIndex]];
    }

    public incrementSymbolIndex(): number {
        this.symbolIndex++;
        return this.symbolIndex;
    }

    public spin(finalSymbols: number[]): void {     
        this.finalSymbols = finalSymbols;
        console.log("final symbols:",this.finalSymbols.map(id => slotSymbolMap[id]));

        this.symbolIndex = 0;
        this.currentState = ReelState.Spinning;
        this.velocity = this.getRandomVelocity();

        for (let i = 0; i < this.symbols.length; i++) {
            const symbol = this.symbols[i];
            symbol.Velocity = this.velocity;
            symbol.State = SymbolState.Spinning;
        }
    }

    /**
     * Returns random velocity multiplied by which reel it is
     * Further to right, the faster the reel spins
     */
    private getRandomVelocity() {
        const randomValueMultiplier = 10;
        const baseVelocity = 30;
        const xPositionMultiplier = 5;

        const velocity = Math.floor(Math.random() * randomValueMultiplier) + baseVelocity + this.reelXIndex * xPositionMultiplier;
        return velocity;
    }

    public get State(): ReelState {
        return this.currentState;
    }

    public get ReelLength(): number {
        return this.reelLength;
    }

    public get FinalSymbol(): Texture {
        const id = this.finalSymbols[this.symbolIndex-1];
        if (this.symbolIndex-1 >= this.finalSymbols.length) {
            console.log("unexpected symbol index:", this.symbolIndex-1);
        }
        return this.symbolsBundle[id];
    }
}
