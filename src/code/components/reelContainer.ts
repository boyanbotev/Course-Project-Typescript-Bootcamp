import { Container, Texture, Assets, Sprite } from "pixi.js";
import { GameScene } from "../scenes/gameScene";
import { SlotSymbol } from "../common/types";
import { Manager } from "../common/manager";
import { Tween } from "tweedle.js";

export class ReelContainer extends Container {
    private reelCount: number = 4; // get from config
    private reelLength: number = 4; // get from config
    private symbolSize: number = 165; // get from config
    private topMargin: number = 65;

    private isRunning: boolean = false;

    private scene: GameScene;

    constructor(scene: GameScene) {
        super();
        console.log("ReelContainer");
        this.scene = scene;
        this.scene.addChild(this);

        const containerWidth = this.reelCount * this.symbolSize;
        this.pivot.x = containerWidth / 2;
        this.x = Manager.Width/2;
    }

    public async createReels(reels: SlotSymbol[][]): Promise<void> {
        const symbolsBundle = await Assets.loadBundle("symbolsBundle");
        if (!symbolsBundle) {
            throw new Error("symbolsBundle not loaded");
        }

        // fragile implementation
        for (let i = 0; i < this.reelCount; i++) {

            const reel = new Reel();
            this.addChild(reel);

            for (let j = 0; j < this.reelLength; j++) { // adapt to have extra reels to ensure player always sees a full reel?
                const symbol = new Symbol();
                symbol.texture = symbolsBundle[reels[i][j]];
                symbol.x = this.symbolSize * i;
                symbol.y = this.symbolSize * j + this.topMargin;
                symbol.width = this.symbolSize;
                symbol.height = this.symbolSize;
                reel.addChild(symbol);
            }
        }
    }

    public async spin(): Promise<void> {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;

        const reels = this.children as Reel[];
        for (let i = 0; i < reels.length; i++) {
            const reel = reels[i];

            const placeHolderDistanceToTween = this.symbolSize/3 * (Math.floor(Math.random()* 2 +1));
            // distance should always be divisible by symbolsize

            const tween = new Tween(reel).to({y: reel.y + placeHolderDistanceToTween}, 4800).start();
            reel.isRunning = true;
            // TODO: add easing
            tween.onComplete(() => {
                // TODO: check if all reels are stopped

                // SHOULDN'T BE NECESSARY
                const tweenUp = new Tween(reel).to({y: this.topMargin}, 100).start();
                reel.isRunning = false;
                this.checkIfStop(reels);
            });
        }
    }

    public update(delta: number): void {
        if (!this.isRunning) {
            return;
        }
        for (let i = 0; i < this.children.length; i++) {
            const reel = this.children[i] as Reel;

            for (let j = 0; j < reel.children.length; j++) {
                const symbol = reel.children[j] as Symbol;
                symbol.y = ((reel.y + j) % this.reelLength) * this.symbolSize - this.symbolSize;
                // incorporate top margin

                // get master reels of all 20 symbols
                // TODO: swap symbols when they go off screen
                if (symbol.y > this.topMargin) {
                    // swap symbol with next in reel

                }
            }
        }
        
    }

    public checkIfStop(reels: Reel[]): void {
        for (let i = 0; i < reels.length; i++) {
            const reel = reels[i];
            if (reel.isRunning) {
                return;
            }
        }
        console.log("stop");
        this.isRunning = false;
    }
}

class Reel extends Container {
    public isRunning: boolean = false;
    constructor() {
        super();
    }
}

class Symbol extends Sprite {
    constructor() {
        super();
    }
}
