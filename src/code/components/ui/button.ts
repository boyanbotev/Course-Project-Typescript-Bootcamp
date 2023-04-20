import { Sprite, Texture, Resource, Container } from "pixi.js";
import { Vector2 } from "../../common/vector2";

export class Button extends Sprite {
    private activeTexture: Texture;
    private inactiveTexture: Texture; // refactor away, add other states for disabled, etc.

    constructor(
        position: Vector2, 
        activeTexture: Texture<Resource>,
        inactiveTexture: Texture<Resource>,
        callback: () => void,
        container: Container,
        scale: number = 1,
    ) {
        super();
        this.activeTexture = activeTexture;
        this.inactiveTexture = inactiveTexture;
        
        this.position.set(position.x, position.y);
        this.anchor.set(0.5, 0.5);
        this.scale.set(scale, scale);

        this.eventMode = "static";
        this.texture = activeTexture;

        this.on("pointerdown", () => {
            callback();
        });
        container.addChild(this);
    }

    public setActive(isActive: boolean) {
        this.texture = isActive ? this.activeTexture : this.inactiveTexture; // change to tint
    }
}
