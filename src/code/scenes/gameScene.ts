import { Container, Assets, Texture } from "pixi.js";
import { IScene } from "../common/IScene";
import { ReelManager } from "../common/ReelManager";

export class GameScene extends Container implements IScene {
    constructor(){
        super();
        console.log("GameScene");
        this.createGame();
    }

    private async createGame(): Promise<void> {
        const symbolsBundle = await Assets.loadBundle("symbolsBundle");
        if (!symbolsBundle) {
            throw new Error("symbolsBundle not loaded");
        }
        const ids = Object.keys(symbolsBundle);
        const symbols = ids.map((id) => symbolsBundle[id] as Texture);
        console.log(symbols);
        const reelManager = new ReelManager();
    }

    public update(delta: number): void {
    }
}