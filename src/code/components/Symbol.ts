import { Sprite } from "pixi.js";

// does Symbol have its own spinning state?
// is it aware of the spinning state of the reel?
// of the slot machine?
export class Symbol extends Sprite {
    private startPoint: number = 0;
    private endPoint: number = 500;
    private velocity: number = 0;
    private decreaseRate: number = 0.1;

    constructor(
        startPoint: number,
        endMargin: number,
    ) {
        super();
        this.startPoint = startPoint;
        this.endPoint = endMargin;
    }

    public update(delta: number): void {
        this.y += delta * this.velocity;

        this.y = (this.y % this.endPoint);

        // TODO: swap symbols when they go off screen
        if (this.y < this.startPoint) {
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
    }
}


// TODO: Add blur

// TODO: add stopping state that instantiates new symbols and tweens them into place
