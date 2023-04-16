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
        container.addChild(this);
        console.log('background created');
        console.log(this);
    }
}