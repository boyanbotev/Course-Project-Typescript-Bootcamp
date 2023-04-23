import { Text, TextStyle } from "pixi.js";
import { config } from "../../common/config";
import { textStyle } from "../../common/textStyle";

export class SmallText extends Text {
    constructor() {   
        super();

        this.text =`BET: ${config.bet}`;
        this.style = textStyle;

        this.anchor.set(0.5, 0.5);
        this.x = -this.width/2;
    }
}