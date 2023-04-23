import { Container } from "pixi.js";
import { BigText } from "./text/bigText";
import { Manager } from "../../common/manager";
import { formatAsEuros } from "../../common/formatAsEuros";
import { config } from "../../common/config";

export class WinBox extends Container {
    private winText: BigText;

    constructor(parent: Container) {
        super();
        parent.addChild(this);
        this.width = 200;
        this.height = 100;
        this.pivot.set(this.width/2, this.height/2);

        this.x = Manager.Width/2;
        this.y = (config.symbolSize * config.reelLength)/2 + config.topMargin;

        this.setVisible(false);

        this.winText = new BigText(this);
    }

    public setWin(win: number): void {
        this.winText.text = formatAsEuros(win);
        this.setVisible(true);
    }

    public setVisible(visible: boolean): void {
        this.visible = visible;
    }
}