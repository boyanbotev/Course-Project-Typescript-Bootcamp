import { Container, Texture, Assets, Graphics } from "pixi.js";
import { GameScene } from "../scenes/gameScene";
import { SlotSymbol } from "../common/types";
import { Manager } from "../common/manager";
import { Reel } from "./Reel";
import { config } from "../common/config";
import { Response, UpdateResponse } from "../common/types";
import { ReelState } from "../common/types";

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
        // Move reel container up so symbols are created off screen to avoid them popping in
        this.y = -(this.symbolSize-this.topMargin);

        this.createMask();
    }

    public async createReels(reels: SlotSymbol[][]): Promise<void> {
        this.reelSymbolMap = reels;
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

    public async spin(spinResult: UpdateResponse): Promise<void> {
        if (!this.areReelsStopped()) {
            return;
        }

        // TODO: parse response and give reels their final symbols
        const result = spinResult["spin-result"];
        const reelIndexes = result.reelIndexes;

        // this gets 1 row of symbols
        
        // const reelSymbols = reelIndexes.map((reelIndex: number, index: number) => {
        //     return this.reelSymbolMap[index][reelIndex];
        // });
        // console.log(reelSymbols);

        for (let i = 0; i < this.reelCount; i++) {
            // for each reel, get the symbol
            console.log("HH____________________");
            const symbolsForCurrentReel: SlotSymbol[] = [];
            for (let j = 0; j < this.reelLength; j++) {
                const n = reelIndexes[i] + j > this.reelSymbolMap[i].length-1 ? reelIndexes[i] + j - this.reelSymbolMap[i].length : reelIndexes[i] + j;
                console.log("N:",n);
                const reelSymbol = this.reelSymbolMap[i][n];
                console.log(reelSymbol);
                symbolsForCurrentReel.push(reelSymbol);
            }
            const reel = this.reels[i];
            reel.spin(symbolsForCurrentReel);
        }

        // const reelSymbols = reelIndexes.map((reelIndex: number, index: number) => {
        //     return this.reelSymbolMap[index][reelIndex];
        // });
        // console.log(reelSymbols);


        // for (let i = 0; i < this.reels.length; i++) {        

        //     const reel = this.reels[i];
        //     reel.spin();
        // }
    }

    private areReelsStopped() {
        let isAllStopped = true;
        for (let i = 0; i < this.reels.length; i++) {
            const reel = this.reels[i];
            console.log(reel.State);
            if (reel.State !== ReelState.Idle) {
                isAllStopped = false;
                break;
            }
        }
        return isAllStopped;
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
