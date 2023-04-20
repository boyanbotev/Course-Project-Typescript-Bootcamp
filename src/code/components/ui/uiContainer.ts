import { Container, Texture, Assets, Text } from "pixi.js";
import { Manager } from "../../common/manager";
import { Button } from "./button";
import { GameScene } from "../../scenes/gameScene";
import { SlotMachine } from "../slotMachine";
import { config } from "../../common/config";
import { BetUIContainer } from "./betUIContainer";

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
        new BetUIContainer(this);
        this.createBalanceUI();
        this.createButton();
    }

    // TODO: tint button when disabled, and disable when balance is 0, and enable when balance is > 0, and tint button on hover, and on click
    private async createButton(): Promise<void> {
        const spinBundle = await Assets.loadBundle("uiBundle");
        const spinImg = spinBundle["spinButton"] as Texture;

        new Button(
            {
                x: Manager.Width/2, 
                y: Manager.Height - spinImg.height/4.3,
            },
            spinImg,
            spinImg,
            () => {
                this.slotMachine.spin();
            },
            this,
            0.5,
        );
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
}
