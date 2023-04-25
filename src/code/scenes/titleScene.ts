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
import { PIXISlotMachine } from "../components/slots/slotMachine";

export class TitleScene extends Container implements Scene {

    private symbols: Background[] = [];
    private title: BigText;
    private text: SmallText;
    private startButton: Button;

    private symbolAnimation: gsap.core.Timeline;

    constructor(){
        super();

        new Background(Manager.Width, Manager.Height, Assets.get("background"), this);

        this.createSymbols();

        this.title = new BigText(this);
        this.title.position.x = Manager.Width / 2;
        this.title.position.y = Manager.Height / 7;
        this.title.text = "ANCIENT\nTREASURES";

        this.text = new SmallText();
        this.addChild(this.text);
        this.text.position.x = Manager.Width / 2;
        this.text.position.y = Manager.Height / 1.75;
        this.text.text = "Are you ready to spin the reels?";

        const buttonTexture = Assets.get("spinButton");
        const btnHoverTexture = Assets.get("spinButtonHover");
        this.startButton = new Button(new Vector2(Manager.Width / 2, Manager.Height / 1.25), buttonTexture, btnHoverTexture,this.startGame.bind(this), this)
        this.startButton.scale.set(0.5);

        // make button pulse
        this.startButton.alpha = 0.8;
        gsap.to(this.startButton.scale, {alpha: 1, x: 0.54, y: 0.54, duration: 0.7, repeat: -1, yoyo: true, yoyoEase: true});
    }

    public async createSymbols(){
        const yBasis = Manager.Height / 2.5;
        
        const size = 210;

        const symbolsBundle = await Assets.loadBundle("symbolsBundle") as SymbolBundle;
        const symbol1 = new Background(size, size, symbolsBundle[14], this);
        symbol1.position.x = Manager.Width / 2 - 200;
        symbol1.position.y = yBasis;
        this.symbols.push(symbol1);

        const symbol2 = new Background(size, size, symbolsBundle[1], this);
        symbol2.position.x = Manager.Width / 2;
        symbol2.position.y = yBasis;
        this.symbols.push(symbol2);

        const symbol3 = new Background(size, size, symbolsBundle[4], this);
        symbol3.position.x = Manager.Width / 2 + 200;
        symbol3.position.y = yBasis;
        this.symbols.push(symbol3);

        const tl = gsap.timeline({repeat: -1, repeatDelay: 0.5});
        tl.to(symbol1, {x: Manager.Width / 2 - 200, y: yBasis - 5, duration: 0.2});
        tl.to(symbol1, {x: Manager.Width / 2 - 200, y: yBasis, duration: 0.2});
        tl.to(symbol2, {x: Manager.Width / 2, y: yBasis - 5, duration: 0.2});
        tl.to(symbol2, {x: Manager.Width / 2, y: yBasis, duration: 0.2});
        tl.to(symbol3, {x: Manager.Width / 2 + 200, y: yBasis - 5, duration: 0.2});
        tl.to(symbol3, {x: Manager.Width / 2 + 200, y: yBasis, duration: 0.2});

        this.symbolAnimation = tl;
    }

    public update(delta: number): void {
    }

    private startGame(): void {
        this.fadeOutSymbols();
        setTimeout(() => {
        Manager.changeScene(new GameScene());
        }, 1000);
    }

    private fadeOutSymbols(): void {
        const duration = 1;
        //gsap.to(this.symbols, {y: Manager.Height+350, duration: duration});
        gsap.to(this.symbols, {alpha: 0, duration: duration/5});

        gsap.to(this.startButton, {alpha: 0, duration: duration/5});
        //gsap.to(this.startButton, {y: Manager.Height+200, duration: duration/3});

        // move title down
        gsap.to(this.title, {y: Manager.Height + 100, ease: "none", duration: duration});
        gsap.to(this.title, {alpha: 0, duration: duration/2})


        this.symbolAnimation.pause();

        // move text down
        gsap.to(this.text, {y: Manager.Height + 500, ease: "none", duration: duration});

        // fade out text
        gsap.to(this.text, {alpha: 0, duration: duration/2});

    }
}