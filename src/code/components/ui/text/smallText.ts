import { Text } from "pixi.js";
import { textStyle } from "./textStyle";

export class SmallText extends Text {   
    constructor() {   
        super();

        this.style = textStyle;

        this.anchor.set(0.5, 0.5);
        this.x = -this.width/2;
    }
}
