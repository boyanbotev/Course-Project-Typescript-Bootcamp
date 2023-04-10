import { Container, Graphics, Assets } from "pixi.js";
import { Manager } from "../common/manager";
import { IScene } from "../common/IScene";
import { manifest } from "../assets";
import { GameScene } from "./gameScene";

export class LoaderScene extends Container implements IScene {

    private loaderBar: Container;
    private loaderBarBoder: Graphics;
    private loaderBarFill: Graphics;

    constructor() {
        super();

        const loaderBarWidth = Manager.Width * 0.8;
        const loaderBarHeight = Manager.Height * 0.05;

        this.loaderBarFill = new Graphics();
        this.loaderBarFill.beginFill(0x00ff00, 1);
        this.loaderBarFill.drawRect(0, 0, loaderBarWidth, loaderBarHeight);
        this.loaderBarFill.endFill();
        this.loaderBarFill.scale.x = 0;

        this.loaderBarBoder = new Graphics();
        this.loaderBarBoder.lineStyle(10, 0x0, 1);
        this.loaderBarBoder.drawRect(0, 0, loaderBarWidth, loaderBarHeight);

        this.loaderBar = new Container();
        this.loaderBar.addChild(this.loaderBarFill);
        this.loaderBar.addChild(this.loaderBarBoder);
        this.loaderBar.position.x = (Manager.Width - this.loaderBar.width) / 2;
        this.loaderBar.position.y = (Manager.Height - this.loaderBar.height) / 2;
        this.addChild(this.loaderBar);

        this.initializeLoader().then(() => {
            this.gameLoaded();
        });

    }

    private async initializeLoader(): Promise<void> {
        await Assets.init({ manifest: manifest });

        const bundleIds = manifest.bundles.map((bundle) => bundle.name);

        await Assets.loadBundle(bundleIds, this.downloadProgress.bind(this));
    }

    private downloadProgress(progress: number): void {
        this.loaderBarFill.scale.x = progress;
    }

    private gameLoaded(): void {
        Manager.changeScene(new GameScene());
    }

    public update(delta: number): void {
    }
}