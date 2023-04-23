import { Container, Assets } from "pixi.js";
import { Scene } from "../common/types";
import { Manager } from "../common/manager";
import { GameScene } from "./gameScene";
import { Background } from "../components/background";
import { WinText } from "../components/ui/winText";
import { Button } from "../components/ui/button";
import { Vector2 } from "../common/vector2";

export class TitleScene extends Container implements Scene {

    constructor(){
        super();

        new Background(Manager.Width, Manager.Height, Assets.get("background"), this);

        const title = new WinText(this);
        title.position.x = Manager.Width / 2;
        title.position.y = Manager.Height / 5;
        title.text = "ANCIENT\nTREASURES";

        const buttonTexture = Assets.get("spinButton");
        const btnHoverTexture = Assets.get("spinButtonHover");
        const startButton = new Button(new Vector2(Manager.Width / 2, Manager.Height / 1.25), buttonTexture, btnHoverTexture,this.startGame.bind(this), this)
        // textButton inherits from button
        // imageButton inherits from button
    }

    public update(delta: number): void {
    }

    private startGame(): void {
        Manager.changeScene(new GameScene());
    }


}