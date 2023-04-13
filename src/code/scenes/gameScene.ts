import { Container, Assets, Texture, Ticker } from "pixi.js";
import { IScene } from "../common/IScene";
import { FakeAPI } from "../backend/fakeAPI";
import { InitResponse, Request } from "../common/types";
import { UIContainer } from "../components/uiContainer";
import { SlotMachine } from "../components/slotMachine";
import { Group } from "tweedle.js";

export class GameScene extends Container implements IScene {
    private bet = 5;

    private api: FakeAPI;
    private slotMachine: SlotMachine;

    constructor(){
        super();

        console.log("GameScene");
        this.api = new FakeAPI();
        this.slotMachine = new SlotMachine(this);
        new UIContainer(this);

        this.createGame();
    }

    private async createGame(): Promise<void> {
        this.init();
        const ticker = Ticker.shared;
        ticker.add(this.update.bind(this));
    }

    private async init(): Promise<void> {
        const request: Request = {
            action: "init",
        }
        const response = await this.api.sendRequest(request) as InitResponse;
        console.log(response);

        this.slotMachine.createReels(response.symbols);
    }

    // doesn't belong in here, refactor later
    public async spin(): Promise<void> {
        const request: Request = {
            action: "spin",
            "bet": this.bet,
        }
        const response = await this.api.sendRequest(request);
        console.log(response);
        this.slotMachine.spin();
    }

    public update(delta: number): void {
        this.slotMachine.updateReels(delta);
    }
}