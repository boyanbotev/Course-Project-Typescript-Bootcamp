import { Container, Assets, Graphics } from "pixi.js";
import { GameScene } from "../scenes/gameScene";
import { SlotSymbol, ReelState, UpdateResponse, SymbolBundle, Request } from "../common/types";
import { Manager } from "../common/manager";
import { Reel } from "./Reel";
import { config } from "../common/config";
import { FakeAPI } from "../backend/fakeAPI";

export class SlotMachine extends Container {
    private reelCount: number = config.reelCount;
    private reelLength: number = config.reelLength;
    private addedReelLength: number = config.reelLength +1;
    private symbolSize: number = config.symbolSize;
    private topMargin: number = config.topMargin;
    private bet: number = config.bet;

    private scene: GameScene;
    private reels: Reel[] = [];
    private reelSymbolMap: SlotSymbol[][] = [];

    private api: FakeAPI;

    constructor(scene: GameScene, api: FakeAPI) {
        super();
        this.scene = scene;
        this.scene.addChild(this);
        this.api = api;

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

        for (let i = 0; i < this.reelCount; i++) {
            const reel = new Reel(i, this.addedReelLength, this.symbolSize, symbolsBundle, reels, this);
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
    public async spin(): Promise<void> {
        if (!this.areReelsStopped()) {
            return;
        }
 
        const reelIndexes = await this.requestSpin();
        if (!reelIndexes) {
            return;
        }

        const reelSymbols = this.calculateReelSymbols(reelIndexes);
        this.reels.forEach((reel, index) => {
            reel.spin(reelSymbols[index]);
        });
    }

    private calculateReelSymbols(reelIndexes: number[]) {  // test function
        const reelSymbols: SlotSymbol[][] = [];
        for (let i = 0; i < this.reelCount; i++) {
            const symbolsForCurrentReel: SlotSymbol[] = [];

            for (let j = 0; j < this.reelLength; j++) {
                const addedIndex = reelIndexes[i] + j;
                const reelSymbolMap = this.reelSymbolMap[i];
                const wrappedIndex = addedIndex > reelSymbolMap.length - 1 ? addedIndex - reelSymbolMap.length : addedIndex;
                const reelSymbol = reelSymbolMap[wrappedIndex];
                symbolsForCurrentReel.push(reelSymbol);
            }
            reelSymbols.push(symbolsForCurrentReel);
        }
        return reelSymbols;
    }

    public async requestSpin(): Promise<number[]> {  
        const request: Request = {
            action: "spin",
            "bet": this.bet,
        }
        const response = await this.api.sendRequest(request);
        console.log(response);

        if (response.action === "error") {
            console.log(response.error);
            return;
        }

        const updateResponse = response as UpdateResponse;
        const result = updateResponse["spin-result"];
        return result.reelIndexes;
    }

    public areReelsStopped() {
        let isAllStopped = true;
        this.reels.forEach((reel) => {
            if (reel.State !== ReelState.Idle) {
                isAllStopped = false;
            }
        });
        return isAllStopped;
    }

    // TODO: use slot machine state only to update reels when necessary
    public updateReels(delta: number): void {
        this.reels.forEach((reel) => {
            reel.updateSymbols(delta);
        });
    }
}
