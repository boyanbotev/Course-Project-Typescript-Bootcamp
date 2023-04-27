import { Sprite, Texture, Container } from "pixi.js";

export class Background extends Sprite {
    constructor(
        imgWidth: number,
        imgHeight: number,
        texture: Texture,
        container: Container,
    ) {
        super(texture);
        this.width = imgWidth;
        this.height = imgHeight;

        this.anchor.set(0.5, 0.5);
        this.position.set(imgWidth/2, imgHeight/2);
        
        container.addChild(this);
    }
}
