import { Container, Assets } from "pixi.js";
import { Scene, SymbolBundle } from "../common/types";
import { Manager } from "../common/manager";
import { GameScene } from "./gameScene";
import { Background } from "../components/background";
import { BigText } from "../components/ui/text/bigText";
import { Button } from "../components/ui/button";
import { Vector2 } from "../common/vector2";
import { SmallText } from "../components/ui/text/smallText";
import { gsap } from "gsap"
import { config } from "../common/config";

export class TitleScene extends Container implements Scene {

    constructor(){
        super();

        new Background(Manager.Width, Manager.Height, Assets.get("background"), this);

        const title = new BigText(this);
        title.position.x = Manager.Width / 2;
        title.position.y = Manager.Height / 7;
        title.text = "ANCIENT\nTREASURES";

        this.createSymbols();

        const text = new SmallText();
        this.addChild(text);
        text.position.x = Manager.Width / 2;
        text.position.y = Manager.Height / 1.75;
        text.text = "Are you ready to spin the reels?";

        const buttonTexture = Assets.get("spinButton");
        const btnHoverTexture = Assets.get("spinButtonHover");
        const startButton = new Button(new Vector2(Manager.Width / 2, Manager.Height / 1.25), buttonTexture, btnHoverTexture,this.startGame.bind(this), this)
        startButton.scale.set(0.5);
    }

    public async createSymbols(){
        const yBasis = Manager.Height / 2.5;
        const size = config.symbolSize + 45;

        const symbolsBundle = await Assets.loadBundle("symbolsBundle") as SymbolBundle;
        const symbol1 = new Background(size, size, symbolsBundle[14], this);
        symbol1.position.x = Manager.Width / 2 - 200;
        symbol1.position.y = yBasis;

        const symbol2 = new Background(size, size, symbolsBundle[1], this);
        symbol2.position.x = Manager.Width / 2;
        symbol2.position.y = yBasis;

        const symbol3 = new Background(size, size, symbolsBundle[4], this);
        symbol3.position.x = Manager.Width / 2 + 200;
        symbol3.position.y = yBasis;

        const tl = gsap.timeline({repeat: -1, repeatDelay: 0.5});
        tl.to(symbol1, {x: Manager.Width / 2 - 200, y: yBasis - 5, duration: 0.2});
        tl.to(symbol1, {x: Manager.Width / 2 - 200, y: yBasis, duration: 0.2});
        tl.to(symbol2, {x: Manager.Width / 2, y: yBasis - 5, duration: 0.2});
        tl.to(symbol2, {x: Manager.Width / 2, y: yBasis, duration: 0.2});
        tl.to(symbol3, {x: Manager.Width / 2 + 200, y: yBasis - 5, duration: 0.2});
        tl.to(symbol3, {x: Manager.Width / 2 + 200, y: yBasis, duration: 0.2});
    }

    public update(delta: number): void {
    }

    private startGame(): void {
        Manager.changeScene(new GameScene());
    }
}