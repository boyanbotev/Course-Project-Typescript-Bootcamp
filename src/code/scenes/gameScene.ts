import { Assets, Container, Ticker } from "pixi.js";
import { Scene, SlotMachine } from "../common/types";
import { FakeAPI } from "../backend/fakeAPI";
import { UIContainer } from "../components/ui/uiContainer";
import { PIXISlotMachine } from "../components/slots/slotMachine";
import { Background } from "../components/background/background";
import { Manager } from "../common/manager";
import { config } from "../common/config";
import { framePadding, frameExtraHeight } from "../common/consts";
import { Frame } from "../components/background/frame";
import { FireWorkContainer } from "../components/firework/fireworkContainer";
import { MusicManager } from "../music/musicManager";

export class GameScene extends Container implements Scene {
    private readonly api: FakeAPI;
    private readonly slotMachine: SlotMachine;
    private readonly frame: Frame;

    constructor() {
        super();

        new Background(Manager.Width, Manager.Height, Assets.get("background"), this);
        this.frame = new Frame(
            config.reelCount * config.symbolSize + framePadding, 
            Manager.Height + frameExtraHeight, 
            Assets.get("frame"), 
            this
        );

        this.api = new FakeAPI();
        this.slotMachine = new PIXISlotMachine(this, this.api); // Should this be here? Dependency injection preferable?
        new UIContainer(this, this.slotMachine);
        new FireWorkContainer(this, this.slotMachine);
        new MusicManager(this.slotMachine);

        const ticker = Ticker.shared;
        ticker.add(this.update.bind(this));

        this.fadeIn(0.5);
    }

    public update(delta: number): void {
        this.slotMachine.updateReels(delta);
    }

    private fadeIn(duration: number): void {
        this.slotMachine.fadeIn(duration);
        this.frame.fadeIn(duration);
    }
}
