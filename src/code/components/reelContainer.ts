import { Container, Texture, Assets } from "pixi.js";
import { GameScene } from "../scenes/gameScene";

export class ReelContainer extends Container {
    private reelCount: number = 4; // get from config
    private reelLength: number = 4; // get from config
    private scene: GameScene;

    constructor(scene: GameScene) {
        super();
        console.log("ReelContainer");
        this.scene = scene;
        this.scene.addChild(this);

        this.createReels();
    }

    private async createReels(): Promise<void> {
        const symbolsBundle = await Assets.loadBundle("symbolsBundle");
        if (!symbolsBundle) {
            throw new Error("symbolsBundle not loaded");
        }
        const ids = Object.keys(symbolsBundle);
        const symbols = ids.map((id) => symbolsBundle[id] as Texture);
    }
}