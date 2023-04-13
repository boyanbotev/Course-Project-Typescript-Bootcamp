import { Container, Texture, Assets, Graphics } from "pixi.js";
import { GameScene } from "../scenes/gameScene";
import { SlotSymbol } from "../common/types";
import { Manager } from "../common/manager";
import { Tween } from "tweedle.js"; // use gsap instead?
import { Reel } from "./Reel";
import { config } from "../common/config";

export class SlotMachine extends Container {
    private reelCount: number = config.reelCount;
    private reelLength: number = config.reelLength;
    private addedReelLength: number = config.reelLength +1;
    private symbolSize: number = config.symbolSize;
    private topMargin: number = config.topMargin;

    private scene: GameScene;
    private reels: Reel[] = [];

    constructor(scene: GameScene) {
        super();
        console.log("ReelContainer");
        this.scene = scene;
        this.scene.addChild(this);

        const containerWidth = this.reelCount * this.symbolSize;
        this.pivot.x = containerWidth / 2;

        this.x = Manager.Width/2;
        // Move reel container up so symbols are created off screen to avoid them popping in
        this.y = -(this.symbolSize-this.topMargin);

        this.createMask();
    }

    public async createReels(reels: SlotSymbol[][]): Promise<void> {
        const symbolsBundle = await Assets.loadBundle("symbolsBundle");
        if (!symbolsBundle) {
            throw new Error("symbolsBundle not loaded");
        }

        console.log(this.reelCount);
        for (let i = 0; i < this.reelCount; i++) {
            const reel = new Reel(i, this.addedReelLength, this.symbolSize, symbolsBundle, reels, this);
            console.log(reel);
            this.reels.push(reel);
        }
    }

    private createMask() {
        const graphics = new Graphics();
        graphics.beginFill(0x000000);
        graphics.drawRect(0, this.symbolSize, this.reelCount * this.symbolSize, this.symbolSize * this.reelLength);
        graphics.endFill();
        this.addChild(graphics);

        this.mask = graphics;
    }

    public async spin(): Promise<void> {
        for (let i = 0; i < this.reels.length; i++) {
            const reel = this.reels[i];
            reel.spin();
        }
    }

    public updateReels(delta: number): void {
        for (let i = 0; i < this.reels.length; i++) {
            const reel = this.reels[i];
            reel.updateSymbols(delta);
        }
    }

    // public checkIfStop(reels: Reel[]): void {
    //     for (let i = 0; i < reels.length; i++) {
    //         const reel = reels[i];
    //         if (reel.isRunning) {
    //             return;
    //         }
    //     }
    //     console.log("stop");
    //     // this.isRunning = false;
    // }

    // how to tween each reel to stop at right symbols?
    // how to reflect velocity of symbols in each reel in the tween?

    // check velocity of each reel
    // if velocity is below a certain threshold
    // tween reel to stop at right symbols

    // but velocity is in the symbol class
    // so how to access it from reel?

    // maybe reel should set the velocity of each symbol?
    // and then reel can check if all symbols are below a certain threshold

    // how to calculate velocity threshold to work regardless of different settings?
}
