import { Container, Texture } from "pixi.js";
import { Symbol } from "./Symbol";
import { SlotSymbol } from "../common/types";
import { ReelState, SymbolState } from "../common/types";

export class Reel extends Container {
    private reelLength: number;
    private symbolSize: number;
    private reelXIndex: number;

    private reels: SlotSymbol[][];
    private symbolsBundle: any;
    private symbols: Symbol[] = [];

    private velocity: number = 0;
    private decreaseRate: number = 0.1;
    private velocityThreshold: number = 15;

    private currentState: ReelState = ReelState.Idle;
    private reelIndex: number = 0;

    constructor(
        reelXpos: number,
        addedReelLength: number,
        symbolSize: number,
        symbolsBundle: any,
        symbolReferenceOrder: SlotSymbol[][],
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
        // fragile implementation for getting symbols from symbolBundle by id
        // should be refactored

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
        if (this.currentState === ReelState.Spinning) {

            if (this.velocity < this.velocityThreshold) {
                    
                this.currentState = ReelState.Stopping;

                // Update symbols' state
                for (let i = 0; i < this.symbols.length; i++) {
                    const symbol = this.symbols[i];
                    symbol.State = SymbolState.PreparingToStop;
                }
            }
                
            this.velocity -= this.decreaseRate;

            for (let i = 0; i < this.symbols.length; i++) {
                const symbol = this.symbols[i];
                symbol.update(delta);
                symbol.Velocity = this.velocity;
            }
        }
        
        if (this.currentState === ReelState.Stopping) {
            for (let i = 0; i < this.symbols.length; i++) {
                const symbol = this.symbols[i];
                symbol.update(delta);
            }

            const stopped = this.areSymbolsStopped();
            if (stopped) {
                this.currentState = ReelState.Idle;
            }
        }
    }

    private areSymbolsStopped(): boolean {
        let isAllStopped = true;
        for (let i = 0; i < this.symbols.length; i++) {
            const symbol = this.symbols[i];
            if (symbol.State != SymbolState.Idle) {
                isAllStopped = false;
            }
        }
        return isAllStopped;
    }

    public getRandomTexture(): Texture {
        const randomIndex = Math.floor(Math.random() * this.reels[this.reelXIndex].length);
        return this.symbolsBundle[this.reels[this.reelXIndex][randomIndex]];
    }

    public incrementReelStoppingIndex(): number {
        this.reelIndex++;
        return this.reelIndex;
    }

    public spin(): void {
        this.reelIndex = 0;
        this.currentState = ReelState.Spinning;
        this.velocity = Math.floor(Math.random() * 10) + 30 + this.reelXIndex * 5;
        for (let i = 0; i < this.symbols.length; i++) {
            const symbol = this.symbols[i];
            symbol.Velocity = this.velocity;
            symbol.State = SymbolState.Spinning;
        }
    }
}

// Weird bugs of symbols flying down through already stopped symbols
// And symbols never being stopped

