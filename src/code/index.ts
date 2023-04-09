import { Application, Sprite, Texture } from "pixi.js";

window.addEventListener("DOMContentLoaded", () => {
    const app = new Application<HTMLCanvasElement>({
        view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
        width: 1600,
        height: 900,
        backgroundColor: 0x000000,
        autoDensity: true,
        resolution: window.devicePixelRatio || 1,
    });
    console.log("PIXI Application created", app);
});