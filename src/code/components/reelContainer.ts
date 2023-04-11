import { Container, Texture, Assets, Sprite } from "pixi.js";
import { GameScene } from "../scenes/gameScene";
import { SlotSymbol } from "../common/types";
import { Manager } from "../common/manager";

export class ReelContainer extends Container {
    private reelCount: number = 4; // get from config
    private reelLength: number = 4; // get from config
    private symbolSize: number = 165; // get from config
    private topMargin: number = 65;

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

            for (let j = 0; j < this.reelLength; j++) {
                const reel = new Reel();
                reel.texture = symbolsBundle[reels[i][j]];
                reel.x = this.symbolSize * i;
                reel.y = this.symbolSize * j + this.topMargin;
                reel.width = this.symbolSize;
                reel.height = this.symbolSize;
                this.addChild(reel);
            }

        }
    }
}

class Reel extends Sprite {
    constructor() {
        super();
    }
}