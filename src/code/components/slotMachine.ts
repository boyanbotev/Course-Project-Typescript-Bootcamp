import { Container, Assets, Graphics } from "pixi.js";
import { GameScene } from "../scenes/gameScene";
import { ReelState, UpdateResponse, SymbolBundle, Request, SlotMachineState, InitResponse } from "../common/types";
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
    private api: FakeAPI;
    private reels: Reel[] = [];

    //private currentState: SlotMachineState = SlotMachineState.Idle;

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
        this.createReels();
    }

    /**
     * Get reel symbol map from server and create reel objects
     */
    public async createReels(): Promise<void> {
        const response = await this.requestSymbolMap();
        const symbolsBundle = await Assets.loadBundle("symbolsBundle") as SymbolBundle;

        if (!symbolsBundle) {
            throw new Error("symbolsBundle not loaded");
        }

        for (let i = 0; i < this.reelCount; i++) {
            const reel = new Reel(i, this.addedReelLength, this.symbolSize, symbolsBundle, response.symbols, this);
            this.reels.push(reel);
        }
    }

    // TODO: add error handling?
    private async requestSymbolMap() {
        const request: Request = {
            action: "init",
        };

        const response = await this.api.sendRequest(request) as InitResponse;
        console.log(response);

        return response;
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
     * Get final symbols for each reel and spin reels
     */
    public async spin(): Promise<void> {
        if (!this.areReelsStopped()) {
            return;
        }

        //this.currentState = SlotMachineState.Spinning;
 
        const updateResponse = await this.requestSpin();
        const result = updateResponse["spin-result"];

        if (!result) {
            return;
        }

        const reelSymbols = result.symbols;

        // TODO: pass win ammount to UI

        this.reels.forEach((reel, index) => {
            reel.spin(reelSymbols[index]);
        });
    }

    private async requestSpin(): Promise<UpdateResponse> {  
        const request: Request = {
            action: "spin",
            "bet": this.bet,
        }
        const response = await this.api.sendRequest(request);
        console.log(response);

        if (response.action === "error") {
            throw new Error(response.error);
        }

        const updateResponse = response as UpdateResponse;
        return updateResponse;
    }

    private areReelsStopped() {
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

// Where to implement highlighting of winning symbols? (and dimming of non-winning symbols)

// where to implement the other UI logic?
