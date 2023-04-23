import { Container} from "pixi.js";
import { Manager } from "../../common/manager";
import { config } from "../../common/config";
import { SmallText } from "./betText";

export class BetUIContainer extends Container {
    constructor(parent: Container) {
        super();
        parent.addChild(this);
        this.width = 200;
        this.height = 100;

        this.pivot.set(this.width/2, this.height/2);

        this.x = (Manager.Width/2) - (config.symbolSize * config.reelCount) / 4 - this.width/2;
        this.y = Manager.Height - 100;

        const betText = new SmallText();

        this.addChild(betText);
    }
}
