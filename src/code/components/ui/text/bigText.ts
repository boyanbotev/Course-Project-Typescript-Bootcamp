import { Text, Container } from "pixi.js";
import { bigTextStyle } from "./textStyle";

export class BigText extends Text { 
    constructor(parent: Container) {
        super();

        this.anchor.set(0.5, 0.5);
        parent.addChild(this);

        this.style = bigTextStyle;
    }
}
