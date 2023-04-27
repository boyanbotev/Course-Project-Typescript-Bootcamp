import { Sprite, Texture, Resource, Container } from "pixi.js";
import { Vector2 } from "../../common/vector2";
import { SmallText } from "./text/smallText";
import { BigText } from "./text/bigText";
import { bigTextStyle } from "./text/textStyle";

enum ButtonState {
    Active,
    Inactive,
}

export class Button extends Sprite {
    private readonly activeTintColor: number = 0xffffff;
    private readonly inactiveTintColor: number = 0xccaacc;

    private standardTexture: Texture<Resource>;
    private hoverTexture: Texture<Resource>;

    private currentState: ButtonState = ButtonState.Active;

    constructor(
        position: Vector2, 
        callback: () => void,
        container: Container,
        texture?: Texture<Resource>,
        hoverTexture?: Texture<Resource>,
        scale: number = 1,
        text?: string,
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

        if (text) {
            this.addText(text);
        }
    }

    private addText(text: string) {
        const txtObj = new BigText(this);
        txtObj.text = text;
        txtObj.style = ({
            ...bigTextStyle,
            dropShadowColor: 0x331116,
            strokeThickness: 10,
            stroke: 0x331116, 
            fontSize: 128,
        });

        txtObj.anchor.set(0.5, 0.6);
        
        this.addChild(txtObj);     
    }

    public setActive(isActive: boolean) {
        this.tint = isActive ? this.activeTintColor : this.inactiveTintColor;
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
// Add optional overloads typescript
