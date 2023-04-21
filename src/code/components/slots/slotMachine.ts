import { Container, Assets, Graphics } from "pixi.js";
import { GameScene } from "../../scenes/gameScene";
import { ReelState, UpdateResponse, SymbolBundle, Request, SlotMachineState, InitResponse, SlotMachineObserver, UpdateAction, UIObserver, UpdateData } from "../../common/types";
import { Manager } from "../../common/manager";
import { Reel } from "./reel";
import { config } from "../../common/config";
import { FakeAPI } from "../../backend/fakeAPI";
import { Firework } from "../firework/firework";
import { APIGateway } from "../../common/apiGateway";

export class SlotMachine extends Container implements UIObserver {
    private reelCount: number = config.reelCount;
    private reelLength: number = config.reelLength;
    private addedReelLength: number = config.reelLength +1;
    private symbolSize: number = config.symbolSize;
    private topMargin: number = config.topMargin;
    private bet: number = config.bet;

    private scene: GameScene;
    private api: FakeAPI;
    private apiGateway: APIGateway;
    private reels: Reel[] = [];

    private currentState: SlotMachineState = SlotMachineState.Idle;
    private spinResult: UpdateResponse;

    private observers: SlotMachineObserver[] = [];

    constructor(scene: GameScene, api: FakeAPI) {
        super();
        this.scene = scene;
        this.scene.addChild(this);
        this.api = api;
        this.apiGateway = new APIGateway(this.api);

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
        const response = await this.apiGateway.requestInitalSymbols();
        const symbolsBundle = await Assets.loadBundle("symbolsBundle") as SymbolBundle;

        if (!symbolsBundle) {
            throw new Error("symbolsBundle not loaded");
        }

        for (let i = 0; i < this.reelCount; i++) {
            const reel = new Reel(
                i, 
                this.addedReelLength, 
                this.symbolSize, 
                symbolsBundle, 
                response.symbols[i], 
                this
                );
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

    public onSpin(): void {
        this.spin();
    }

    public onBetChange(bet: number): void {
        this.bet = bet;
    }

    /**
     * Get final symbols for each reel and spin reels
     */
    public async spin(): Promise<void> {
        if (!this.areReelsStopped()) {
            return;
        }
 
        const updateResponse = await this.apiGateway.requestSpin(this.bet);
        this.spinResult = updateResponse;

        const result = updateResponse["spin-result"];
   
        if (!result) {
            return;
        }

        this.currentState = SlotMachineState.Spinning;
        this.notifyObservers(UpdateAction.Spin);

        const reelSymbols = result.symbols;

        // TODO: pass win ammount to UI
        const isWin = result.win === undefined ? false : true;

        this.reels.forEach((reel, index) => {
            reel.spin(reelSymbols[index]);
        });
    }

    private areReelsStopped(): boolean {
        let isAllStopped = true;
        this.reels.forEach((reel) => {
            if (reel.State !== ReelState.Idle) {
                isAllStopped = false;
            }
        });
        return isAllStopped;
    }

    public checkIfReelsStopped() {
        const isAllStopped = this.areReelsStopped();
        if (isAllStopped) {
            this.currentState = SlotMachineState.Idle;
            console.log("all reels stopped");
            this.handleReelStopped();
        }
    }

    private handleReelStopped() {
        if (!this.spinResult) {
            return;
        }
        const result = this.spinResult["spin-result"];
        if (!result) {
            return;
        }

        this.notifyObservers(UpdateAction.Stop);

        if (result.win) {
            this.highlightWinningSymbols();
            new Firework(this);
            // remove dependency on firework by making firework (or a firework manager class) a slotmachine observer? or a WinManager
        }
    }

    private highlightWinningSymbols() {
        const paylineLength = this.getHighestWinningLineIndex() + 1;
        this.reels.forEach((reel) => {
            reel.highlightWinningSymbols(paylineLength);
        });
    }

    private getHighestWinningLineIndex(): number {
        const result = this.spinResult["spin-result"];
        if (!result) {
            return;
        }
        const symbols = result.symbols;

        let highestWinningLineIndex = 0;
        symbols.forEach((reel) => {
            reel.forEach((symbolRef) => {
                if (symbolRef.winningLineIndex !== undefined) {
                    if (symbolRef.winningLineIndex > highestWinningLineIndex) {
                        highestWinningLineIndex = symbolRef.winningLineIndex;
                    }
                }
            });
        });
        return highestWinningLineIndex;
    }

    public updateReels(delta: number): void {
        if (this.currentState !== SlotMachineState.Spinning) {
            return;
        }
        this.reels.forEach((reel) => {
            reel.updateSymbols(delta);
        });
    }

    public get State() {
        return this.currentState;
    }

    public addObserver(observer: SlotMachineObserver) {
        this.observers.push(observer);
    }

    public removeObserver(observer: SlotMachineObserver) {
        this.observers = this.observers.filter((obs) => obs !== observer);
    }

    public notifyObservers(action: UpdateAction, data?: UpdateData) {
        this.observers.forEach((observer) => {
            switch (action) {
                case UpdateAction.Spin:
                    observer.onSpin();
                    break;
                case UpdateAction.Stop:
                    observer.onSpinComplete();
                    break;
                case UpdateAction.Win:
                    observer.onWin(data as number);
                    break;
                case UpdateAction.BalanceUpdate:
                    observer.onBalanceUpdate(data as number);
                    break;
                default:
                    break;
            }
        });
    }
}

// TODO: Add readonly

// Remove dependency on GameScene by passing app instance, an width and height values in constructor?

// Extract areReelsStopped, checkIfReelsStopped, handleReelStopped into separate classes/functions?

// TODO: Update loading screen
