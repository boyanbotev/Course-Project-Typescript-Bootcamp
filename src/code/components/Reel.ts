import { Container, Texture } from "pixi.js";
import { Symbol } from "./Symbol";
import { SymbolBundle, SymbolReference } from "../common/types";
import { ReelState, SymbolState } from "../common/types";
import { slotSymbolMap } from "../common/consts";

export class Reel extends Container {
    private reelLength: number;
    private symbolSize: number;
    private reelXIndex: number;

    private symbolsBundle: SymbolBundle;
    private symbols: Symbol[] = [];

    private velocity: number = 0;
    private decreaseRate: number = 0.1;
    private velocityThreshold: number = 15;

    private currentState: ReelState = ReelState.Idle;
    private symbolIndex: number = 0;

    private finalSymbols: SymbolReference[] = [];
    private isWin: boolean = false;

    constructor(
        reelXpos: number,
        addedReelLength: number,
        symbolSize: number,
        symbolsBundle: SymbolBundle,
        initialSymbols: number[],
        parent: Container
    ) {
        super();
        this.reelXIndex = reelXpos;
        this.reelLength = addedReelLength;
        this.symbolSize = symbolSize;
        this.symbolsBundle = symbolsBundle;

        parent.addChild(this);
        this.createSymbols(initialSymbols);
    }

    public createSymbols(initialSymbols: number[]): void {
        for (let j = 0; j < this.reelLength; j++) {
            const symbol = new Symbol(this.symbolSize, (this.symbolSize * this.reelLength), this);

            symbol.texture = this.symbolsBundle[initialSymbols[j]];
            symbol.x = this.symbolSize * this.reelXIndex + (this.symbolSize/2);
            symbol.y = this.symbolSize * j + this.symbolSize + (this.symbolSize/2);
            symbol.width = this.symbolSize;
            symbol.height = this.symbolSize;
            symbol.anchor.set(0.5, 0.5);

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
                    if (this.isWin) {
                        this.highlightWinningSymbols();
                    }
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
       const randomIndex = Math.floor(Math.random() * Object.keys(this.symbolsBundle).length);
         return this.symbolsBundle[randomIndex +1];
    }

    public incrementSymbolIndex(): number {
        this.symbolIndex++;
        return this.symbolIndex;
    }

    public spin(finalSymbols: SymbolReference[], isWin: boolean): void {    
        this.finalSymbols = finalSymbols;
        this.isWin = isWin;
        console.log("final symbols:",this.finalSymbols.map(symbolRef => slotSymbolMap[symbolRef.symbolId]));

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

    private highlightWinningSymbols() {
        this.finalSymbols.forEach((symbolRef, index) => {
            const symbol = this.symbols.find(symbol => symbol.SymbolIndex === index +1);

            if (symbolRef.winningLineIndex !== undefined) {
                symbol.highlight();
            } else {
                symbol.darken();
            }
        });
    }

    public get State(): ReelState {
        return this.currentState;
    }

    public get ReelLength(): number {
        return this.reelLength;
    }

    public get FinalSymbol(): Texture {
        const symbolRef = this.finalSymbols[this.symbolIndex-1];
        if (this.symbolIndex-1 >= this.finalSymbols.length) {
            console.log("unexpected symbol index:", this.symbolIndex-1);
        }
        return this.symbolsBundle[symbolRef.symbolId];
    }
}
