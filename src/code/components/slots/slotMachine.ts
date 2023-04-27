import { Container, Assets, Graphics } from "pixi.js";
import { ReelState, UpdateResponse, SymbolBundle, SlotMachineState, SlotMachineObserver, UpdateAction, UIObserver, UpdateData, SlotMachine } from "../../common/types";
import { Manager } from "../../common/manager";
import { PIXIReel } from "./reel";
import { config } from "../../common/config";
import { FakeAPI } from "../../backend/fakeAPI";
import { APIGateway } from "../../common/apiGateway";
import { gsap } from "gsap";

export class PIXISlotMachine extends Container implements UIObserver, SlotMachine {    
    private readonly reelCount: number = config.reelCount;
    private readonly reelLength: number = config.reelLength;
    private readonly addedReelLength: number = config.reelLength +1;
    private readonly symbolSize: number = config.symbolSize;
    private readonly topMargin: number = config.topMargin;
    private bet: number = config.bet;
    private balance: number = config.initialBalance;

    private readonly scene: Container;
    private readonly api: FakeAPI;
    private readonly apiGateway: APIGateway;
    private reels: PIXIReel[] = [];

    private currentState: SlotMachineState = SlotMachineState.Idle;
    private spinResult: UpdateResponse;

    private observers: SlotMachineObserver[] = [];

    constructor(scene: Container, api: FakeAPI) {
        super();
        this.scene = scene;
        this.scene.addChild(this);
        this.api = api;
        this.apiGateway = new APIGateway(this.api);

        const containerWidth = this.reelCount * this.symbolSize;
        this.pivot.x = containerWidth / 2;

        this.x = Manager.Width/2;

        /*
        Move reel container upwards to ensure symbols are created off screen 
        To avoid them popping in
        */
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
            const reel = new PIXIReel(
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
        this.setBalance(this.balance - this.bet);

        const reelSymbols = result.symbols;

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

            this.notifyObservers(UpdateAction.Win, result.win);
        }

        const win = result.win || 0;
        this.setBalance(this.balance + win);
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

    public fadeIn(duration: number): void {
        this.alpha = 0;
        gsap.to(this, {alpha: 1, duration: duration});
    }

    private setBalance(balance: number) {
        this.balance = balance;
        this.notifyObservers(UpdateAction.BalanceUpdate, balance);
    }
}

// Extract areReelsStopped, checkIfReelsStopped, handleReelStopped into separate classes/functions?

// TODO: Update loading screen

// investigate symbol mystery

// TODO: Use Spritesheet for symbols

// TODO: sort out web.yml

// think about reel and symbol responsibilities

// TODO: text size responsive to ratio of reelCount to reelLength?
