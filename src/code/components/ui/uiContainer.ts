import { Container, Texture, Assets, Text } from "pixi.js";
import { Manager } from "../../common/manager";
import { Button } from "./button";
import { GameScene } from "../../scenes/gameScene";
import { SlotMachine } from "../slots/slotMachine";
import { config } from "../../common/config";
import { BetUIContainer } from "./betUIContainer";
import { SlotMachineObserver, UIAction, UIData, UIObserver } from "../../common/types";

export class UIContainer extends Container implements SlotMachineObserver{
    private scene: GameScene;
    private slotMachine: SlotMachine;
    private button: Button;

    private observers: UIObserver[] = [];

    constructor(scene: GameScene, slotMachine: SlotMachine) {
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
        this.createBalanceUI();
        this.createButton();
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
    }

    public onSpinComplete(): void {
        this.enableSlotsUI();
    }

    public onWin(): void {
    }

    public onBalanceUpdate(): void {
    }

    private async createWinText(): Promise<void> {
    }

    private async createBalanceUI(): Promise<void> {
        const balanceText = new Text(`${config.initialBalance}`, {
            fontFamily: "Garamond",
            fontSize: 48,
            fill: 0xffee00,
            align: "center",
            fontWeight: "bold",
        });

        balanceText.anchor.set(0.5, 0.5);

        balanceText.x = (Manager.Width/2) + ((config.symbolSize * config.reelCount) / 4) + balanceText.width/2;
        balanceText.y = Manager.Height - 100;

        this.addChild(balanceText);
    }
    // TODO: update balance

    public disableSlotsUI(): void {
        this.button.setActive(false);
    }

    public enableSlotsUI(): void {
        this.button.setActive(true);
    }
}
