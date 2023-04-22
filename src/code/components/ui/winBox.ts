import { Container } from "pixi.js";
import { WinText } from "./winText";
import { Manager } from "../../common/manager";

export class WinBox extends Container {
    private winText: WinText;

    constructor(parent: Container) {
        super();
        parent.addChild(this);
        this.width = 200;
        this.height = 100;
        this.pivot.set(this.width/2, this.height/2);

        this.x = Manager.Width/2;
        this.y = Manager.Height/2;

        this.setVisible(false);

        this.winText = new WinText(this);
    }

    public setWin(win: number): void {
        this.winText.text = "WIN: " + win.toString();
        this.setVisible(true);
    }

    public setVisible(visible: boolean): void {
        this.visible = visible;
    }
}