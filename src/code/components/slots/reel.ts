import { Container, Texture, BlurFilter } from "pixi.js";
import { Symbol } from "./symbol";
import { SymbolBundle, SymbolReference } from "../../common/types";
import { ReelState, SymbolState, SlotMachineState } from "../../common/types";
import { slotSymbolMap, multiplier, xIndexMultiplier, baseVelocity } from "../../common/consts";
import { SlotMachine } from "./slotMachine";

export class Reel extends Container {
    private readonly reelLength: number;
    private readonly symbolSize: number;
    private readonly reelXIndex: number;

    private readonly symbolsBundle: SymbolBundle;
    private readonly symbols: Symbol[] = [];

    private velocity: number = 0;
    private readonly decreaseRate: number = 0.1;
    private readonly blurDecreaseRate: number = 0.0017;
    private readonly velocityThreshold: number = 15;

    private currentState: ReelState = ReelState.Idle;
    private symbolIndex: number = 0;

    private finalSymbols: SymbolReference[] = [];
    private blurFilter: BlurFilter;

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
        this.blurFilter = new BlurFilter(0, 1, 4);
        this.filters = [this.blurFilter];
    }

    public createSymbols(initialSymbols: number[]): void {
        for (let j = 0; j < this.reelLength; j++) {
            const symbol = new Symbol(this.symbolSize, (this.symbolSize * this.reelLength), this);

            symbol.texture = this.symbolsBundle[initialSymbols[j]];
    
            symbol.x = this.symbolSize * this.reelXIndex;
            symbol.y = this.symbolSize * j + this.symbolSize;
            
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
                    this.setBlur();
                });

                if (this.velocity < this.velocityThreshold) {          
                    this.beginStopping();
                }  
                break;
            case ReelState.Stopping:
                this.symbols.forEach((symbol) => {
                    symbol.update(delta);
                    this.decreaseBlur();
                });
    
                const stopped = this.areSymbolsStopped();

                if (stopped) {
                    this.currentState = ReelState.Idle;
                    const slotMachine = this.parent as SlotMachine;
                    if (slotMachine.State === SlotMachineState.Spinning) {
                        slotMachine.checkIfReelsStopped();
                    }
                }
                break;
        }   
    }

    private setBlur() {
        this.blurFilter.blurY = this.velocity / 3;
    }

    private decreaseBlur() {
        if (this.blurFilter.blurY > 0) {
            this.blurFilter.blurY -= this.blurDecreaseRate;
        } else {
            this.blurFilter.blurY = 0;
        }
    }

    private beginStopping() {
        this.currentState = ReelState.Stopping;

        this.symbols.forEach((symbol) => {
            symbol.State = SymbolState.PreparingToStop;
            this.blurFilter.blurY = 0;
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

    public spin(finalSymbols: SymbolReference[]): void {    
        this.finalSymbols = finalSymbols;
        console.log("final symbols:",this.finalSymbols.map(symbolRef => slotSymbolMap[symbolRef.symbolId]));

        this.symbolIndex = 0;
        this.currentState = ReelState.Spinning;
        this.velocity = getRandomVelocity(this.reelXIndex);

        for (let i = 0; i < this.symbols.length; i++) {
            const symbol = this.symbols[i];
            symbol.Velocity = this.velocity;
            symbol.State = SymbolState.Spinning;
            symbol.reset();
        }
    }

    // TODO: refactor to make separate paylines animate separately
    public highlightWinningSymbols(paylineLength: number) { // paylineLength should not be calculated here
        console.log("payline length:", paylineLength);

        this.finalSymbols.forEach((symbolRef, index) => {
            const symbol = this.symbols.find(symbol => symbol.SymbolIndex === index +1);

            if (symbolRef.winningLineIndex !== undefined) {
                symbol.initializePulse(symbolRef.winningLineIndex, paylineLength);
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
            throw new Error(`unexpected symbol index:  ${this.symbolIndex-1}`);
        }
        return this.symbolsBundle[symbolRef.symbolId];
    }
}

/**
 * Returns random velocity multiplied by which reel it is
 * Further to right, the faster the reel spins
 */
function getRandomVelocity(reelXIndex: number) {
    return Math.floor(Math.random() * multiplier) + baseVelocity + reelXIndex * xIndexMultiplier;
}
