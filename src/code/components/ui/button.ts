import { Sprite, Texture, Resource, Container } from "pixi.js";
import { Vector2 } from "../../common/vector2";

enum ButtonState {
    Active,
    Inactive,
}

export class Button extends Sprite {
    private activeTintColor: number = 0xffffff;
    private inactiveTintColor: number = 0xccaacc;
    private activeAlpha: number = 1;
    private inactiveAlpha: number = 0.8;

    private standardTexture: Texture<Resource>;
    private hoverTexture: Texture<Resource>;

    private currentState: ButtonState = ButtonState.Active;

    constructor(
        position: Vector2, 
        texture: Texture<Resource>,
        hoverTexture: Texture<Resource>,
        callback: () => void,
        container: Container,
        scale: number = 1,
    ) {
        super();
        this.texture = texture;
        this.standardTexture = texture;
        this.hoverTexture = hoverTexture;
        
        this.position.set(position.x, position.y);
        this.anchor.set(0.5, 0.5);
        this.scale.set(scale, scale);

        this.eventMode = "static";

        this.on("pointerdown", () => {
            callback();
        });

        this.on("pointerover", () => {
            this.setHoverActive(true);
        });

        this.on("pointerout", () => {
            this.setHoverActive(false);
        });

        container.addChild(this);
    }

    public setActive(isActive: boolean) {
        this.tint = isActive ? this.activeTintColor : this.inactiveTintColor;
        this.alpha = isActive ? this.activeAlpha : this.inactiveAlpha;
        this.currentState = isActive ? ButtonState.Active : ButtonState.Inactive;
        this.eventMode = isActive ? "static" : "none";

        this.setHoverActive(false);
    }

    public setHoverActive(isActive: boolean) {
        if (this.currentState === ButtonState.Inactive) {
            return;
        }
        this.texture = isActive ? this.hoverTexture : this.standardTexture;
    }
}
