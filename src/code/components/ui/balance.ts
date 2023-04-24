import { Container } from "pixi.js";
import { config } from "../../common/config";
import { Manager } from "../../common/manager";
import { formatAsEuros } from "../../common/formatAsEuros";
import { SmallText } from "./text/smallText";

export class BalanceContainer extends Container {
    private balanceText: SmallText;

    constructor(parent: Container) {
        super();
        parent.addChild(this);
        const width = 100;
        const height = 50; // do something with this?

        this.balanceText = new SmallText();
        this.addChild(this.balanceText);

        this.balanceText.text = formatAsEuros(config.initialBalance);
    
        this.pivot.set(width/2, 0);
    
        this.x = (Manager.Width/2) + ((config.symbolSize * config.reelCount) / 4) + width;
        this.y = Manager.Height - 100;
    }

    public updateBalance(balance: number): void {
        this.balanceText.text = formatAsEuros(balance);
    }
}
// TODO: refactor to be SmallText ? In a balanceContainer?
