import { Container, Ticker } from "pixi.js";
import { IScene } from "../common/IScene";
import { FakeAPI } from "../backend/fakeAPI";
import { UIContainer } from "../components/uiContainer";
import { SlotMachine } from "../components/slotMachine";

export class GameScene extends Container implements IScene {

    private api: FakeAPI;
    private slotMachine: SlotMachine;

    constructor(){
        super();

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
