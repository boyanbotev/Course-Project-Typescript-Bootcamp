import { Container, Texture, Assets, Text } from "pixi.js";
import { Manager } from "../../common/manager";
import { Button } from "./button";
import { GameScene } from "../../scenes/gameScene";
import { SlotMachine } from "../slots/slotMachine";
import { config } from "../../common/config";
import { BetUIContainer } from "./betUIContainer";
import { SlotMachineObserver, UIAction, UIData, UIObserver } from "../../common/types";
import { Balance } from "./balance";
import { WinBox } from "./winBox";

export class UIContainer extends Container implements SlotMachineObserver{
    private readonly scene: Container;
    private readonly slotMachine: SlotMachine;
    private button: Button;
    private balanceText: Balance;
    private winBox: WinBox;

    private observers: UIObserver[] = [];

    constructor(scene: Container, slotMachine: SlotMachine) {
        super();
        this.scene = scene;
        this.slotMachine = slotMachine;
        this.scene.addChild(this);
        this.slotMachine.addObserver(this);
        this.addObserver(this.slotMachine);

        this.createUI();
    }

    private createUI(): void {
        new BetUIContainer(this);
        this.balanceText = new Balance(this);
        this.createButton();
        this.createWinText();
    }

    // TODO: disable button when balance is 0, and enable when balance is > 0
    private async createButton(): Promise<void> {
        const spinBundle = await Assets.loadBundle("uiBundle");
        const spinImg = spinBundle["spinButton"] as Texture;
        const spinHover = spinBundle["spinButtonHover"] as Texture;

        this.button = new Button(
            {
                x: Manager.Width/2, 
                y: Manager.Height - spinImg.height/4.3,
            },
            spinImg,
            spinHover,
            () => {
                this.onSpinBtnPress();
            },
            this,
            0.5,
        );
    }

    public addObserver(observer: UIObserver): void {
        this.observers.push(observer);
    }

    private notifyObservers(action: UIAction, data?: UIData): void {
        this.observers.forEach((observer) => {
            switch (action) {
                case "spin":
                    observer.onSpin();
                    break;
                case "betChange":
                    observer.onBetChange(data as number);
                    break;
            }
        });
    }

    public onSpinBtnPress(): void {
        this.notifyObservers(UIAction.Spin);
    }

    public onSpin(): void {
        this.disableSlotsUI();
        this.winBox.setVisible(false);
    }

    public onSpinComplete(): void {
        console.log("onSpinComplete");
        this.enableSlotsUI();
    }

    public onWin(win: number): void {
        console.log("onWin");
        this.winBox.setWin(win);
    }

    public onBalanceUpdate(balance: number): void {
        this.balanceText.updateBalance(balance);

        console.log("balance: ", balance, "bet: ", config.bet);
        if (balance < config.bet) { // TODO: get bet from elsewhere
            this.disableSlotsUI();
        }
    }

    private async createWinText(): Promise<void> {
        this.winBox = new WinBox(this);
    }

    public disableSlotsUI(): void {
        this.button.setActive(false);
    }

    public enableSlotsUI(): void {
        this.button.setActive(true);
    }
}
