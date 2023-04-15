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
    private symbolIndex: number;

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
        const wrapThreshold = 16;
        if (this.y <= wrapThreshold) {

            switch (this.currentState) {
                case SymbolState.PreparingToStop:
                    this.velocity = 0;
                    this.currentState = SymbolState.Stopping;
    
                    this.initializeTween();
    
                    // If symbol is not the last (extra) one, set texture to final symbol
                    if (this.symbolIndex-1 !== this.reel.ReelLength-1){
                        this.texture = this.getFinalSymbol();
                    }
                    break;
                default:
                    this.texture = this.reel.getRandomTexture();
                    break;
            }
        }
    }

    /** 
     * Make animations duration shorter the later in the reel they start to make symbols move at same speed
     * Difference in duration betwen indexes flexible given symbol size
     * Smaller symbolsize means smaller difference in duration 
     */
    private initializeTween() {
        this.symbolIndex = this.reel.incrementSymbolIndex();

        const standardSymbolSize = 165;
        const baseDuration = 0.6;
        const xPositionMultiplier = 0.09;

        const duration = baseDuration - (this.symbolIndex * xPositionMultiplier * (this.startPoint / standardSymbolSize));
        const targetY = this.endPoint - (this.startPoint * this.symbolIndex)

        gsap.to(this, { y: targetY, duration: duration, onComplete: () => {
            this.currentState = SymbolState.Idle;
        }});
    }

    private getFinalSymbol(): Texture {
        return this.reel.FinalSymbol;
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

    public set SymbolIndex(index: number) {
        this.symbolIndex = index;
    }
}

// TODO: Add blur
