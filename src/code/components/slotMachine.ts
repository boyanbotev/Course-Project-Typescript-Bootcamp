import { Container, Texture, Assets } from "pixi.js";
import { GameScene } from "../scenes/gameScene";
import { SlotSymbol } from "../common/types";
import { Manager } from "../common/manager";
import { Tween } from "tweedle.js"; // use gsap instead?
import { Reel } from "./Reel";

enum SpinningState {
    Idle,
    Spinning, // randomly assinging symbols
    Stopping, // preparing symbols specified by backend
}

export class SlotMachine extends Container {
    private reelCount: number = 4; // get from config
    private reelLength: number = 4; // get from config
    private symbolSize: number = 165; // get from config
    private topMargin: number = 65;

    private scene: GameScene;
    private reels: Reel[] = [];

    constructor(scene: GameScene) {
        super();
        console.log("ReelContainer");
        this.scene = scene;
        this.scene.addChild(this);
        //this.topMargin = this.symbolSize; //maybe?

        const containerWidth = this.reelCount * this.symbolSize;
        this.pivot.x = containerWidth / 2;
        this.x = Manager.Width/2;
    }

    public async createReels(reels: SlotSymbol[][]): Promise<void> {
        const symbolsBundle = await Assets.loadBundle("symbolsBundle");
        if (!symbolsBundle) {
            throw new Error("symbolsBundle not loaded");
        }

        for (let i = 0; i < this.reelCount; i++) {
            const reel = new Reel(i, this.reelLength, this.symbolSize, this.topMargin, symbolsBundle, reels, this);
            this.reels.push(reel);
        }
    }

    public async spin(): Promise<void> {
        // for each reel, start spin
        for (let i = 0; i < this.reels.length; i++) {
            const reel = this.reels[i];
            reel.spin();
        }
    }

    public update(delta: number): void {
        for (let i = 0; i < this.reels.length; i++) {
            const reel = this.reels[i];
            reel.update(delta);
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
        // this.isRunning = false;
    }
}

// TODO: Add masking to reels
