import { Assets, Container, Ticker } from "pixi.js";
import { IScene } from "../common/IScene";
import { FakeAPI } from "../backend/fakeAPI";
import { UIContainer } from "../components/uiContainer";
import { SlotMachine } from "../components/slotMachine";
import { Background } from "../components/background";
import { Manager } from "../common/manager";

export class GameScene extends Container implements IScene {

    private api: FakeAPI;
    private slotMachine: SlotMachine;

    constructor(){
        super();

        new Background(Manager.Width, Manager.Height, Assets.get("background1"), this);

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
