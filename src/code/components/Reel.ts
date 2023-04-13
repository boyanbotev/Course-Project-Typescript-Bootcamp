import { Container, Texture } from "pixi.js";
import { Symbol } from "./Symbol";
import { SlotSymbol } from "../common/types";

// does Reel have its own spinning state?
// is it aware of the spinning state of the reel?
// of the slot machine?
export class Reel extends Container {
    private reelLength: number;
    private symbolSize: number;
    private reelXIndex: number;

    private reels: SlotSymbol[][];
    private symbolsBundle: any;
    private symbols: Symbol[] = [];
    public isRunning: boolean = false;

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
        for (let i = 0; i < this.symbols.length; i++) {
            const symbol = this.symbols[i];
            symbol.update(delta);
        }
    }

    public getRandomTexture(): Texture {
        const randomIndex = Math.floor(Math.random() * this.reels[this.reelXIndex].length);
        return this.symbolsBundle[this.reels[this.reelXIndex][randomIndex]];
    }

    public spin(): void {
        const randomSpeed = Math.floor(Math.random() * 10) + 30 + this.reelXIndex * 5;
        this.isRunning = true;
        for (let i = 0; i < this.symbols.length; i++) {
            const symbol = this.symbols[i];
            symbol.Velocity = randomSpeed;
        }
    }
}
