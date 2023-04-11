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

            for (let j = 0; j < this.reelLength; j++) {
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
        console.log("spin");
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;

        const reels = this.children as Reel[];
        for (let i = 0; i < reels.length; i++) {
            const reel = reels[i];
            // tween reel
            const distanceToTween = this.symbolSize * 1 * Math.floor(Math.random() * 2 + 1);
            const tween = new Tween(reel).to({y: reel.y + distanceToTween}, 10000).start();
        }
    }

    public update(delta: number): void {
        if (!this.isRunning) {
            return;
        }
        for (let i = 0; i < this.children.length; i++) {
            const reel = this.children[i] as Reel;
            // if (reel.y > this.symbolSize * this.reelLength) {
            //     reel.y = 0;
            // }
            for (let j = 0; j < reel.children.length; j++) {
                const symbol = reel.children[j] as Symbol;
                //symbol.y = (reel.y + this.symbolSize * j + this.topMargin) % (this.symbolSize * this.reelLength);
                symbol.y = ((reel.y + j) % this.reelLength) * this.symbolSize - this.symbolSize;
            }
        }
    }

    public stop(): void {
        console.log("stop");
        this.isRunning = false;
    }


}

class Reel extends Container {
    constructor() {
        super();
    }
}

class Symbol extends Sprite {
    constructor() {
        super();
    }
}