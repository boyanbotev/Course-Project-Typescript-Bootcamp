import { Sprite, Texture } from "pixi.js";
import { Reel } from "./Reel";
import { ReelState, SymbolState } from "../common/types";
import { gsap } from "gsap";

export class Symbol extends Sprite {
    private startPoint: number = 0;
    private endPoint: number = 500;
    private velocity: number = 0;
    private reel: Reel;

    private currentState: SymbolState = SymbolState.Idle;
    private reelIndex: number = Math.floor(Math.random() * 4 + 1);
   // private isTweening: boolean = false;

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

        // Checks if y is very small, because checking if 0 will not work
        if (this.y <= this.startPoint / 5) { // was 10
            this.swapSymbols();
            if (this.currentState === SymbolState.PreparingToStop) {
                this.initializeTween();
                this.velocity = 0;
                this.currentState = SymbolState.Stopping;
                console.log("stop", this.currentState);
            }
        }  
        console.log("currentState:", this.currentState, "y:", this.y, "velocity:", this.velocity);
    }

    public set Velocity(velocity: number) {
        this.velocity = velocity;
    }

    public set State(state: SymbolState) {
        this.currentState = state;
    }

    public set ReelIndex(index: number) {
        this.reelIndex = index;
    }

    private initializeTween() {
        this.reelIndex = this.reel.incrementReelStoppingIndex();
        console.log(this.endPoint - (this.startPoint * this.reelIndex));

        // make difference in duration betwen indexes flexible given symbol size
        // smaller symbolsize means smaller difference in duration
        const duration = 0.6 - (this.reelIndex * 0.09 * (this.startPoint / 165));

        gsap.to(this, { y: this.y + (this.endPoint - (this.startPoint * this.reelIndex)), duration: duration, onComplete: () => {
            this.currentState = SymbolState.Idle;
        }});
    }


    private swapSymbols(): void {
        // request random symbol from reel
        // set symbol to that symbol
        const texture: Texture = this.reel.getRandomTexture();
        this.texture = texture;
    }
}


// TODO: Add blur

// TODO: add stopping state that instantiates new symbols and tweens them into place
