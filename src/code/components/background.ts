import { Sprite, Texture, Container } from "pixi.js";

export class Background extends Sprite {
    constructor(
        screenWidth: number,
        screenHeight: number,
        texture: Texture,
        container: Container,
    ) {
        super(texture);
        this.width = screenWidth;
        this.height = screenHeight;

        this.anchor.set(0.5, 0.5);
        this.position.set(screenWidth/2, screenHeight/2);
        
        container.addChild(this);
    }
}