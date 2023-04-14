import { Sprite, Texture } from "pixi.js";
import { Reel } from "./Reel";
import { SymbolState } from "../common/types";
import { gsap } from "gsap";

export class Symbol extends Sprite {
    private startPoint: number = 0;
    private endPoint: number = 500;
    private velocity: number = 0;
    private reel: Reel;

    private currentState: SymbolState = SymbolState.Idle;
    private reelIndex: number = Math.floor(Math.random() * 4 + 1);

    constructor(
        startPoint: number,
        endMargin: number,
        reel: Reel
    ) {
        super();
        this.startPoint = startPoint;
        this.endPoint = endMargin;
        this.reel = reel;
    }

    public update(delta: number): void {
        if (this.currentState === SymbolState.Idle || this.currentState === SymbolState.Stopping) {
            return;
        }

        this.y += delta * this.velocity;

        this.y = (this.y % this.endPoint);

        this.handleWrap();  
    }

    /** 
     * Checks if y is very small, because checking if 0 will not work
     * Swap texture to wrap around reel
     */
    private handleWrap() {
        if (this.y <= 16) {
            if (this.currentState === SymbolState.PreparingToStop) {
                this.initializeTween();

                this.velocity = 0;
                this.currentState = SymbolState.Stopping;

                this.texture = this.getFinalSymbol();
            } else {
                this.texture = this.reel.getRandomTexture();
            }
        }
    }

    public set Velocity(velocity: number) {
        this.velocity = velocity;
    }

    public get State(): SymbolState {
        return this.currentState;
    }

    public set State(state: SymbolState) {
        this.currentState = state;
    }

    public set ReelIndex(index: number) {
        this.reelIndex = index;
    }

    private initializeTween() {
        this.reelIndex = this.reel.incrementReelStoppingIndex();

        // Difference in duration betwen indexes flexible given symbol size
        // Smaller symbolsize means smaller difference in duration
        const duration = 0.6 - (this.reelIndex * 0.09 * (this.startPoint / 165));
        const targetY = this.endPoint - (this.startPoint * this.reelIndex)

        gsap.to(this, { y: targetY, duration: duration, onComplete: () => {
            this.currentState = SymbolState.Idle;
        }});
    }

    private getFinalSymbol(): Texture { // This is getting called one two many times. Why?
        return this.reel.FinalSymbol;
    }
}

// TODO: Add blur
