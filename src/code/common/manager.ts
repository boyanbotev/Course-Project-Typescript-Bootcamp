import { Application } from "pixi.js";
import { IScene } from "./IScene";

export class Manager {
    private constructor() {}
    private static app: Application;
    private static currentScene: IScene;

    private static width: number;
    private static height: number;

    public static get Width(): number {
        return Manager.width;
    }

    public static get Height(): number {
        return Manager.height;
    }

    public static initialize(width: number, height: number, backgroundColor: number): void {
        Manager.width = width;
        Manager.height = height;
        Manager.app = new Application({
            view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
            resolution: window.devicePixelRatio || 1,
            width: width,
            height: height,
            autoDensity: true,
            backgroundColor: backgroundColor,
        });

        Manager.app.ticker.add(Manager.update);
    }

    public static changeScene(newScene: IScene): void {

        if (Manager.currentScene) {
            Manager.app.stage.removeChild(Manager.currentScene);
            Manager.currentScene.destroy();
        }

        Manager.currentScene = newScene;
        Manager.app.stage.addChild(Manager.currentScene);
    }

    private static update(delta: number): void {
        if (Manager.currentScene) {
            Manager.currentScene.update(delta);
        }
    }
}

