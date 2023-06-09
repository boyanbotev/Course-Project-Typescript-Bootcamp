import { Texture, Container } from "pixi.js";
import { gsap } from "gsap";
import { Background } from "./background";
import { Manager } from "../../common/manager";
import { frameYAdjust } from "../../common/consts";


export class Frame extends Background {
    constructor(
        imgWidth: number,
        imgHeight: number,
        texture: Texture,
        container: Container,
    ) {
        super(imgWidth, imgHeight, texture, container);

        this.x = Manager.Width/2;
        this.y = Manager.Height/2 -frameYAdjust;
    }

    public fadeIn(duration: number): void {
        this.alpha = 0;
        this.visible = true;
        gsap.to(this, {alpha: 1, duration: duration});
    }
}
