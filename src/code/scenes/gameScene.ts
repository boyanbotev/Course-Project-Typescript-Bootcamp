import { Container, Ticker } from "pixi.js";
import { IScene } from "../common/IScene";
import { FakeAPI } from "../backend/fakeAPI";
import { InitResponse, Request } from "../common/types";
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

        this.createGame();
    }

    private async createGame(): Promise<void> {
        this.initializeReels();
        const ticker = Ticker.shared;
        ticker.add(this.update.bind(this));
    }

    private async initializeReels(): Promise<void> {
        const request: Request = {
            action: "init",
        }
        const response = await this.api.sendRequest(request) as InitResponse;
        console.log(response);

        this.slotMachine.createReels(response.symbols);
    }

    public update(delta: number): void {
        this.slotMachine.updateReels(delta);
    }
}