import { Text, Container } from "pixi.js";
import { config } from "../../common/config";
import { textStyle } from "../../common/consts";
import { Manager } from "../../common/manager";

export class Balance extends Text {
    constructor(parent: Container) {
        super();
        console.log("Balance created")
        parent.addChild(this);

        this.text = formatAsEuros(config.initialBalance);
        this.style = textStyle;
    
        this.anchor.set(0.5, 0.5);
    
        this.x = (Manager.Width/2) + ((config.symbolSize * config.reelCount) / 4) + this.width/2;
        this.y = Manager.Height - 100;
    }

    public updateBalance(balance: number): void {
        this.text = formatAsEuros(balance);
    }
}

function formatAsEuros(amount: number): string {
    return amount.toLocaleString("en-GB", { style: "currency", currency: "EUR" });
}