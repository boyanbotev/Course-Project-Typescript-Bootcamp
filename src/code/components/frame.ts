import { Background } from "./background";
import { Texture, Container } from "pixi.js";
import { Manager } from "../common/manager";
import { frameYAdjust } from "../common/consts";

export class Frame extends Background {
    constructor(
        screenWidth: number,
        screenHeight: number,
        texture: Texture,
        container: Container,
    ) {
        super(screenWidth, screenHeight, texture, container);

        this.x = Manager.Width/2;
        this.y = Manager.Height/2 -frameYAdjust;
    }
}
