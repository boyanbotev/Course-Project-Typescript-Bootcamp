import { Assets, Container, Ticker } from "pixi.js";
import { Scene, SlotMachine } from "../common/types";
import { FakeAPI } from "../backend/fakeAPI";
import { UIContainer } from "../components/ui/uiContainer";
import { PIXISlotMachine } from "../components/slots/slotMachine";
import { Background } from "../components/background";
import { Manager } from "../common/manager";
import { config } from "../common/config";
import { framePadding, frameExtraHeight } from "../common/consts";
import { Frame } from "../components/frame";
import { FireWorkContainer } from "../components/firework/fireworkContainer";

export class GameScene extends Container implements Scene {

    private api: FakeAPI;
    private slotMachine: SlotMachine;

    constructor() {
        super();

        new Background(Manager.Width, Manager.Height, Assets.get("background"), this);
        new Frame(config.reelCount * config.symbolSize + framePadding, Manager.Height + frameExtraHeight, Assets.get("frame"), this);
        // TODO: fade in frame, fade in slot machine

        this.api = new FakeAPI();
        this.slotMachine = new PIXISlotMachine(this, this.api); // should this be here? dependency injection
        new UIContainer(this, this.slotMachine);
        new FireWorkContainer(this, this.slotMachine);

        const ticker = Ticker.shared;
        ticker.add(this.update.bind(this));
    }

    public update(delta: number): void {
        this.slotMachine.updateReels(delta);
    }
}
