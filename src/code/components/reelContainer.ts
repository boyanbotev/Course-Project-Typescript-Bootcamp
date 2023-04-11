import { Container, Texture, Assets, Sprite } from "pixi.js";
import { GameScene } from "../scenes/gameScene";
import { SlotSymbol } from "../common/types";

export class ReelContainer extends Container {
    private reelCount: number = 4; // get from config
    private reelLength: number = 4; // get from config
    private scene: GameScene;

    constructor(scene: GameScene) {
        super();
        console.log("ReelContainer");
        this.scene = scene;
        this.scene.addChild(this);
    }

    public async createReels(reels: SlotSymbol[][]): Promise<void> {
        const symbolsBundle = await Assets.loadBundle("symbolsBundle");
        if (!symbolsBundle) {
            throw new Error("symbolsBundle not loaded");
        }
        const ids = Object.keys(symbolsBundle);
        const symbols = ids.map((id) => symbolsBundle[id] as Texture);

        console.log("symbols", symbols);

        for (let i = 0; i < this.reelCount; i++) {
            const reel = new Reel();
        }
    }
}

class Reel extends Sprite {
    constructor() {
        super();
    }
}