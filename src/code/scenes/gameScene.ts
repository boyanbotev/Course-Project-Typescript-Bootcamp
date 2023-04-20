import { Assets, Container, Ticker } from "pixi.js";
import { Scene } from "../common/types";
import { FakeAPI } from "../backend/fakeAPI";
import { UIContainer } from "../components/ui/uiContainer";
import { SlotMachine } from "../components/slotMachine";
import { Background } from "../components/background";
import { Manager } from "../common/manager";
import { config } from "../common/config";
import { framePadding, frameExtraHeight } from "../common/consts";
import { Frame } from "../components/frame";

export class GameScene extends Container implements Scene {

    private api: FakeAPI;
    private slotMachine: SlotMachine;

    constructor(){
        super();

        new Background(Manager.Width, Manager.Height, Assets.get("background"), this);
        new Frame(config.reelCount * config.symbolSize + framePadding, Manager.Height + frameExtraHeight, Assets.get("frame"), this);

        this.api = new FakeAPI();
        this.slotMachine = new SlotMachine(this, this.api); // should this be here? dependency injection
        new UIContainer(this, this.slotMachine);

        const ticker = Ticker.shared;
        ticker.add(this.update.bind(this));
    }

    public update(delta: number): void {
        this.slotMachine.updateReels(delta);
    }
}
