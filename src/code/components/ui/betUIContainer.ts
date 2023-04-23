import { Container} from "pixi.js";
import { Manager } from "../../common/manager";
import { config } from "../../common/config";
import { SmallText } from "./text/smallText";

export class BetUIContainer extends Container {
    constructor(parent: Container) {
        super();
        parent.addChild(this);
        const width = 100;
        const height = 50;

        this.pivot.set(width/2, 0); // adjust pivot to take into account height?

        this.x = (Manager.Width/2) - (config.symbolSize * config.reelCount) / 4;
        this.y = Manager.Height - 100;

        const betText = new SmallText();
        betText.text = `BET: ${config.bet}`;

        this.addChild(betText);
    }
}
