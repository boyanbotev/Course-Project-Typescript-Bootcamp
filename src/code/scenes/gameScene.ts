import { Container, Assets, Texture } from "pixi.js";
import { IScene } from "../common/IScene";
import { FakeAPI } from "../common/fakeAPI";
import { Button } from "../components/button";
import { Request } from "../common/types";

export class GameScene extends Container implements IScene {
    private api: FakeAPI;
    private bet = 5;

    constructor(){
        super();

        console.log("GameScene");
        this.api = new FakeAPI();
        this.createGame();
    }

    private async createGame(): Promise<void> {
        const symbolsBundle = await Assets.loadBundle("symbolsBundle");
        if (!symbolsBundle) {
            throw new Error("symbolsBundle not loaded");
        }
        const ids = Object.keys(symbolsBundle);
        const symbols = ids.map((id) => symbolsBundle[id] as Texture);
        console.log(symbols);

        this.init();

        const button = new Button(
            { x: 100, y: 100 },
            symbols[0],
            symbols[1],
            () => {
                this.spin();
            },
            this,
        );

    }

    private async init(): Promise<void> {
        const request: Request = {
            action: "init",
        }
        const response = await this.api.sendRequest(request);
        console.log(response);
    }

    private async spin(): Promise<void> {
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