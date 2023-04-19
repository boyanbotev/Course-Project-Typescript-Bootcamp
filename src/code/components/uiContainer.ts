import { Container, Texture, Assets, Text } from "pixi.js";
import { Manager } from "../common/manager";
import { Button } from "./button";
import { GameScene } from "../scenes/gameScene";
import { SlotMachine } from "./slotMachine";
import { config } from "../common/config";

export class UIContainer extends Container {
    private scene: GameScene;
    private slotMachine: SlotMachine;

    constructor(scene: GameScene, slotMachine: SlotMachine) {
        super();
        this.scene = scene;
        this.slotMachine = slotMachine;
        this.scene.addChild(this);

        this.createUI();
    }

    private createUI(): void {
        this.createBetUI();
        this.createBalanceUI();
        this.createButton();
    }

    private async createButton(): Promise<void> {
        const spinBundle = await Assets.loadBundle("uiBundle");
        const spin = spinBundle["spinButton"] as Texture;

        new Button(
            {
                x: Manager.Width/2, 
                y: Manager.Height - spin.height/4.3,
            },
            spin,
            spin,
            () => {
                this.slotMachine.spin();
            },
            this,
            0.5,
        );
    }

    private async createWinText(): Promise<void> {
    }

    private async createBetUI(): Promise<void> { // extract text object into class?
        const bet = config.bet;

        const betText = new Text(`BET: ${bet}`, {
            fontFamily: "Garamond",
            fontSize: 48,
            fill: 0xffff00,
            align: "center",
            fontWeight: "bold",
        });

        betText.anchor.set(0.5, 0.5);

        betText.x = (Manager.Width/2) - (config.symbolSize * config.reelCount) / 4 - betText.width/2;
        betText.y = Manager.Height - 100;

        this.addChild(betText);

    }

    private async createBalanceUI(): Promise<void> {
        const balanceText = new Text(`${config.initialBalance}`, {
            fontFamily: "Garamond",
            fontSize: 48,
            fill: 0xffff00,
            align: "center",
            fontWeight: "bold",
        });

        balanceText.anchor.set(0.5, 0.5);

        balanceText.x = (Manager.Width/2) + ((config.symbolSize * config.reelCount) / 4) + balanceText.width/2;
        balanceText.y = Manager.Height - 100;

        this.addChild(balanceText);
    }
}
