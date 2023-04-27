import { Sprite, Texture, Resource, Container } from "pixi.js";
import { Vector2 } from "../../common/vector2";
import { BigText } from "./text/bigText";
import { bigTextStyle } from "./text/textStyle";
import { ButtonOptions } from "../../common/types";

enum ButtonState {
    Active,
    Inactive,
}

export class Button extends Sprite {
    private readonly activeTintColor: number = 0xffffff;
    private readonly inactiveTintColor: number = 0xccaacc;

    private standardTexture: Texture<Resource>;
    private hoverTexture: Texture<Resource>;
    private text: BigText;

    private currentState: ButtonState = ButtonState.Active;

    constructor(
        position: Vector2, 
        callback: () => void,
        container: Container,
        options?: ButtonOptions,
    ) {
        super();
        if (options.texture) {
            this.texture = options.texture;
            this.standardTexture = options.texture;
        }

        if (options.hoverTexture) {
            this.hoverTexture = options.hoverTexture;
        }

        if (options.scale) {
            this.scale.set(options.scale, options.scale);
        }

        if (options.text) {
            this.addText(options.text);
        }
        
        this.position.set(position.x, position.y);
        this.anchor.set(0.5, 0.5);
        container.addChild(this);

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
    }

    private addText(text: string) {
        this.text = new BigText(this);
        this.text.text = text;
        this.text.style = ({
            ...bigTextStyle,
            dropShadowColor: 0x331116,
            strokeThickness: 10,
            stroke: 0x331116, 
            fontSize: 128,
        });

        this.text.anchor.set(0.5, 0.6);
        
        this.addChild(this.text);     
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
        if (this.text) {
            this.text.scale.set(isActive ? 1.1 : 1);
        }
    }
}
