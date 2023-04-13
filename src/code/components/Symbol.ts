import { Sprite, Texture } from "pixi.js";
import { Reel } from "./Reel";
import { SpinningState } from "../common/types";
import { Tween } from "tweedle.js";

// does Symbol have its own spinning state?
// is it aware of the spinning state of the reel?
// of the slot machine?

export class Symbol extends Sprite {
    private startPoint: number = 0;
    private endPoint: number = 500;
    private velocity: number = 0;
    private reel: Reel;

    private currentState: SpinningState = SpinningState.Idle;
    private reelIndex: number = Math.floor(Math.random() * 4 + 1);
    private isTweening: boolean = false;

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
        if (this.currentState === SpinningState.Idle) {
            return;
        }
        this.y += delta * this.velocity;

        this.y = (this.y % this.endPoint);

        // Checks if y is very small, because checking if 0 will not work
        if (this.y <= this.startPoint / 10) {
            this.swapSymbols();
            if (this.currentState === SpinningState.Stopping && !this.isTweening) {
                this.initializeTween();
                this.velocity = 0;
                this.isTweening = true;
            }
            if (this.currentState === SpinningState.Spinning) {
                this.isTweening = false;
            }
        }  
        console.log(this.y);
    }

    public set Velocity(velocity: number) {
        this.velocity = velocity;
    }

    public set State(state: SpinningState) {
        this.currentState = state;
    }

    public set ReelIndex(index: number) {
        this.reelIndex = index;
    }

    private initializeTween() {
        this.reelIndex = this.reel.incrementReelStoppingIndex();
        console.log(this.endPoint - (this.startPoint * this.reelIndex));
        const tween = new Tween(this)
            .to({ y: this.y + (this.endPoint - (this.startPoint * this.reelIndex))}, 280)
            //.easing(Tween.Easing.Cubic.Out)
            .start();
        tween.onComplete(() => {
            this.currentState = SpinningState.Idle;
        });
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
