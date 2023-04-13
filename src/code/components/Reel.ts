import { Container } from "pixi.js";
import { Symbol } from "./Symbol";
import { SlotSymbol } from "../common/types";

// does Reel have its own spinning state?
// is it aware of the spinning state of the reel?
// of the slot machine?
export class Reel extends Container {
    private reelLength: number;
    private symbolSize: number;
    private topMargin: number;
    private reelXIndex: number;

    private reels: SlotSymbol[][];
    private symbolsBundle: any;
    private symbols: Symbol[] = [];
    public isRunning: boolean = false;
    constructor(
        reelXpos: number,
        reelLength: number,
        symbolSize: number,
        topMargin: number,
        symbolsBundle: any,
        symbolReferenceOrder: SlotSymbol[][],
        parent: Container
    ) {
        super();
        this.reelXIndex = reelXpos;
        this.reelLength = reelLength;
        this.symbolSize = symbolSize;
        this.topMargin = topMargin;
        this.symbolsBundle = symbolsBundle;
        this.reels = symbolReferenceOrder;
        parent.addChild(this);
        this.createSymbols();
    }

    public createSymbols(): void {
        // fragile implementation for getting symbols from symbolBundle by id
        // should be refactored

        for (let j = 0; j < this.reelLength; j++) { // adapt to have extra reels to ensure player always sees a full reel?
            const symbol = new Symbol(this.topMargin, (this.symbolSize * this.reelLength));
            symbol.texture = this.symbolsBundle[this.reels[this.reelXIndex][j]];
            symbol.x = this.symbolSize * this.reelXIndex;
            symbol.y = this.symbolSize * j + this.topMargin;
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

    public spin(): void {
        const randomSpeed = Math.floor(Math.random() * 10) + 30 + this.reelXIndex * 5;
        this.isRunning = true;
        for (let i = 0; i < this.symbols.length; i++) {
            const symbol = this.symbols[i];
            symbol.Velocity = randomSpeed;
        }
    }
}
