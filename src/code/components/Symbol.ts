import { Sprite, Texture } from "pixi.js";
import { Reel } from "./Reel";

// does Symbol have its own spinning state?
// is it aware of the spinning state of the reel?
// of the slot machine?
export class Symbol extends Sprite {
    private startPoint: number = 0;
    private endPoint: number = 500;
    private velocity: number = 0;
    private decreaseRate: number = 0.1;
    private reel: Reel;

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
        this.y += delta * this.velocity;

        this.y = (this.y % this.endPoint);

        // Checks if y is very small, because checking if 0 will not work
        if (this.y <= this.startPoint / 10) {
            this.swapSymbols();
        }

        if (this.velocity > 0) {
            this.velocity -= this.decreaseRate;
        } else {
            this.velocity = 0;
        }      
    }

    public set Velocity(velocity: number) {
        this.velocity = velocity;
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
