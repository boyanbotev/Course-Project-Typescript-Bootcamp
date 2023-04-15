import { Container, Assets, Graphics } from "pixi.js";
import { GameScene } from "../scenes/gameScene";
import { SlotSymbol, ReelState, UpdateResponse, SymbolBundle } from "../common/types";
import { Manager } from "../common/manager";
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
    private reelSymbolMap: SlotSymbol[][] = [];

    constructor(scene: GameScene) {
        super();
        console.log("ReelContainer");
        this.scene = scene;
        this.scene.addChild(this);

        const containerWidth = this.reelCount * this.symbolSize;
        this.pivot.x = containerWidth / 2;

        this.x = Manager.Width/2;

        // Move reel container upwards to ensure symbols are created off screen to avoid them popping in
        this.y = -(this.symbolSize-this.topMargin);

        this.createMask();
    }

    public async createReels(reels: SlotSymbol[][]): Promise<void> {
        this.reelSymbolMap = reels;
        const symbolsBundle = await Assets.loadBundle("symbolsBundle") as SymbolBundle;
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

    /**
     * Get final symbols for each reel and spin them
     */
    public spin(spinResult: UpdateResponse) {
        const result = spinResult["spin-result"];
        const reelIndexes = result.reelIndexes;

        for (let i = 0; i < this.reelCount; i++) {
            console.log("HH____________________");
            const symbolsForCurrentReel: SlotSymbol[] = [];

            for (let j = 0; j < this.reelLength; j++) {
                const addedIndex = reelIndexes[i] + j;
                const reelSymbolMap = this.reelSymbolMap[i];
                const n = addedIndex > reelSymbolMap.length-1 ? addedIndex - reelSymbolMap.length : addedIndex;
                console.log("N:",n);
                const reelSymbol = reelSymbolMap[n];
                console.log(reelSymbol);
                symbolsForCurrentReel.push(reelSymbol);
            }
            const reel = this.reels[i];
            reel.spin(symbolsForCurrentReel);
        }
    }

    public areReelsStopped() {
        let isAllStopped = true;
        this.reels.forEach((reel) => {
            if (reel.State !== ReelState.Idle) {
                isAllStopped = false;
            }
        });
        console.log("Idle");
        return isAllStopped;
    }

    public updateReels(delta: number): void {
        this.reels.forEach((reel) => {
            reel.updateSymbols(delta);
        });
    }
}
