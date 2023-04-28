import { Container, Assets, Texture } from "pixi.js";
import { gsap } from "gsap"
import { CustomEase } from "gsap/all";
import { Scene } from "../common/types";
import { Manager } from "../common/manager";
import { GameScene } from "./gameScene";
import { Background } from "../components/background/background";
import { Button } from "../components/ui/button";
import { Vector2 } from "../common/vector2";
import { SmallText } from "../components/ui/text/smallText";
import { Title } from "../components/title-screen/title";
import { TitleScreenSymbols } from "../components/title-screen/titleScreenSymbols";
import { SpriteSheetLoader } from "../common/assets/spriteSheetLoader"

export class TitleScene extends Container implements Scene { 
    private readonly symbols: TitleScreenSymbols;
    private readonly title: Title;

    private text: SmallText;
    private startButton: Button;
    private buttonAnimation: gsap.core.Tween;

    private isStarted: boolean = false;

    constructor(){
        super();

        new Background(Manager.Width, Manager.Height, Assets.get("background"), this);

        this.symbols = new TitleScreenSymbols(this);
        this.title = new Title(this, "ANCIENT\nTREASURES");
        
        this.createText();
        this.createButton();
    }

    private createText() {
        this.text = new SmallText();
        this.addChild(this.text);
        this.text.position.x = Manager.Width / 2;
        this.text.position.y = Manager.Height / 1.75;
        this.text.text = "Are you ready to spin the reels?";
    }

    private createButton() {
        const spritesheet = SpriteSheetLoader.spritesheet;
        const buttonTexture = spritesheet["spinButton"] as Texture;
        const hoverTexture = spritesheet["spinButtonHover"] as Texture;

        this.startButton = new Button(
            new Vector2(Manager.Width / 2,
                Manager.Height / 1.25),
            this.startGame.bind(this),
            this,
            { 
                texture: buttonTexture, 
                hoverTexture: hoverTexture, 
                scale: 0.68, 
                text: "START" 
            },
        );

        this.makeButtonPulse();
    }

    private makeButtonPulse() {
        this.buttonAnimation = gsap.to(this.startButton.scale, { x: 0.60, y: 0.60, duration: 0.7, repeat: -1, yoyo: true, yoyoEase: true });
    }

    public update(delta: number): void {
    }

    private startGame(): void {
        if (this.isStarted) return;
        this.isStarted = true;

        this.animateRemoveElements(1.2);

        setTimeout(() => {
            Manager.changeScene(new GameScene());
            this.title.destroy();
            this.symbols.destroy();
        }, 1800);
    }

    private animateRemoveElements(duration: number): void {
        this.symbols.tweenAway(duration);

        setTimeout(() => {
            this.animateElements(duration);
        }, duration * 360);
    }

    /*
     * Animates title, text and button down the screen
     */
    private animateElements(duration: number): void {
        const finalYOffset = 100;

        const ease = CustomEase.create(
            "custom", "M0,0,C0.672,0.054,0.74,0.31,0.792,0.388,0.846,0.469,0.896,0.668,1,1"
        );

        this.title.animateTitleDown(finalYOffset, ease, duration);
        this.moveTextDown(finalYOffset, ease, duration);
        this.moveButtonIntoPosition(duration);
    }

    private moveButtonIntoPosition(duration: number) {
        this.buttonAnimation.kill();

        const targetHeight = Manager.Height - this.startButton.texture.height / 4.3;
        const moveDuration = duration / 2;
        const textFadeDuration = duration * 1.4;

        gsap.to(this.startButton, { y: targetHeight, duration: moveDuration });
        gsap.to(this.startButton.scale, { x: 0.5, y: 0.5, duration: moveDuration })
        gsap.to(this.startButton.text, { alpha: 0, duration: textFadeDuration })
    }

    private moveTextDown(finalYOffset: number, ease: any, duration: number) {
        const targetPosition = Manager.Height + finalYOffset * 4.7;
        const moveDuration = duration * 1.1;

        gsap.to(this.text, { y: targetPosition, ease: ease, duration: moveDuration });

        const fadeDuration = duration * 1.1;
        gsap.to(this.text, { alpha: 0, ease: ease, duration: fadeDuration });
    }
}
