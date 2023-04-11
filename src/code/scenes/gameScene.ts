import { Container, Assets, Texture } from "pixi.js";
import { IScene } from "../common/IScene";
import { FakeAPI } from "../backend/fakeAPI";
import { InitResponse, Request } from "../common/types";
import { UIContainer } from "../components/uiContainer";
import { ReelContainer } from "../components/reelContainer";

export class GameScene extends Container implements IScene {
    private bet = 5;

    private api: FakeAPI;
    private reels: ReelContainer;


    constructor(){
        super();

        console.log("GameScene");
        this.api = new FakeAPI();
        this.reels = new ReelContainer(this);
        new UIContainer(this);

        this.createGame();
    }

    private async createGame(): Promise<void> {
        this.init();
    }

    private async init(): Promise<void> {
        const request: Request = {
            action: "init",
        }
        const response = await this.api.sendRequest(request) as InitResponse;
        console.log(response);

        this.reels.createReels(response.symbols);
    }

    public async spin(): Promise<void> {
        const request: Request = {
            action: "spin",
            "bet": this.bet,
        }
        const response = await this.api.sendRequest(request);
        console.log(response);
    }

    public update(delta: number): void {
    }
}