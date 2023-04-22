import { Text, Container } from "pixi.js";
import { bigTextStyle } from "../../common/textStyle";

export class WinText extends Text {
    constructor(parent: Container) {
        super();
        console.log("WinText");
        this.anchor.set(0.5, 0.5);
        parent.addChild(this);

        this.text = "W I N";
        this.style = bigTextStyle;
    }
}