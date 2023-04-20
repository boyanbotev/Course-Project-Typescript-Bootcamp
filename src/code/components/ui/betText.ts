import { Text, TextStyle } from "pixi.js";
import { config } from "../../common/config";
import { textStyle } from "../../common/consts";

export class BetText extends Text {
    constructor() {   
        super();
        console.log("BetText created")

        this.text =`BET: ${config.bet}`;
        this.style = textStyle;

        this.anchor.set(0.5, 0.5);
        this.x = -this.width/2;
    }
}