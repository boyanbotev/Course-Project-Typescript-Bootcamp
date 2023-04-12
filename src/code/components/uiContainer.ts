import { Container, Texture, Assets } from "pixi.js";
import { Manager } from "../common/manager";
import { Button } from "./button";
import { GameScene } from "../scenes/gameScene";


export class UIContainer extends Container {
    private scene: GameScene;
    constructor(scene: GameScene) {
        super();
        console.log("UIContainer");
        this.scene = scene;
        this.scene.addChild(this);

        this.createUI();
    }

    private async createUI(): Promise<void> {
        const spinBundle = await Assets.loadBundle("uiBundle");
        const spin = spinBundle["spinButton"] as Texture;

        // TODO: relate button size to reel size?
        new Button(
            {
                x: Manager.Width/2, 
                y: Manager.Height - spin.height/3,
            },
            spin,
            spin,
            () => {
                this.scene.spin();
            },
            this,
            0.5,
        );
    }
    
}