import { Container} from "pixi.js";
import { Manager } from "../../common/manager";
import { config } from "../../common/config";
import { SmallText } from "./text/smallText";
import { formatAsEuros } from "../../common/utils/formatAsEuros";

export class BetUIContainer extends Container {  
    constructor(parent: Container) {
        super();
        parent.addChild(this);
        const width = 100;

        this.pivot.set(width/2, 0);

        this.x = (Manager.Width/2) - (config.symbolSize * config.reelCount) / 4;
        this.y = Manager.Height - 100;

        const betText = new SmallText();
        betText.text = `BET: ${formatAsEuros(config.bet)}`;

        this.addChild(betText);
    }
}
