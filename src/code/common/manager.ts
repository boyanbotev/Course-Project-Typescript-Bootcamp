import { Application } from "pixi.js";
import { Scene } from "./types";
import gsap from "gsap";

export class Manager {
    private constructor() {}
    private static app: Application;
    private static currentScene: Scene;

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

        this.app.ticker.stop();

        // Now, we use 'tick' from gsap
        gsap.ticker.add(() => {
            this.app.ticker.update();
        });

        Manager.app.ticker.add(Manager.update);

        window.addEventListener("resize", Manager.resize);

        Manager.resize();
    }

    public static resize(): void {
        const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        const scale = Math.min(screenWidth / Manager.width, screenHeight / Manager.height);

        const enlargedWidth = Math.floor(Manager.width * scale);
        const enlargedHeight = Math.floor(Manager.height * scale);

        const horizontalMargin = (screenWidth - enlargedWidth) / 2;
        const verticalMargin = (screenHeight - enlargedHeight) / 2;

        const view = Manager.app.view as HTMLCanvasElement;
        view.style.width = enlargedWidth + "px";
        view.style.height = enlargedHeight + "px";
        view.style.marginLeft = view.style.marginRight = horizontalMargin + "px";
        view.style.marginTop = view.style.marginBottom = verticalMargin + "px";
    }

    public static changeScene(newScene: Scene): void {

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

