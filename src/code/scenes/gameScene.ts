import { Assets, Container, Ticker } from "pixi.js";
import { IScene } from "../common/IScene";
import { FakeAPI } from "../backend/fakeAPI";
import { UIContainer } from "../components/uiContainer";
import { SlotMachine } from "../components/slotMachine";
import { Background } from "../components/background";
import { Manager } from "../common/manager";
import { config } from "../common/config";

export class GameScene extends Container implements IScene {

    private api: FakeAPI;
    private slotMachine: SlotMachine;

    constructor(){
        super();

        new Background(Manager.Width, Manager.Height, Assets.get("background1"), this);
        const padding = 165;
        const frame = new Background(config.reelCount * config.symbolSize + padding, Manager.Height + 240, Assets.get("frame"), this);
        frame.x = Manager.Width/2;
        frame.y = Manager.Height/2 -20;

        this.api = new FakeAPI();
        this.slotMachine = new SlotMachine(this, this.api);
        new UIContainer(this, this.slotMachine);

        const ticker = Ticker.shared;
        ticker.add(this.update.bind(this));
    }

    public update(delta: number): void {
        this.slotMachine.updateReels(delta);
    }
}
