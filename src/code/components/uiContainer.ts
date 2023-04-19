import { Container, Texture, Assets } from "pixi.js";
import { Manager } from "../common/manager";
import { Button } from "./button";
import { GameScene } from "../scenes/gameScene";
import { SlotMachine } from "./slotMachine";

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

    private async createBetUI(): Promise<void> {
    }

    private async createBalanceUI(): Promise<void> {

    }
}
