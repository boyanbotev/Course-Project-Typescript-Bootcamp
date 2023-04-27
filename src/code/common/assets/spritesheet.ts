import { Spritesheet, BaseTexture, Assets, Resource, Texture } from "pixi.js";
import type { Dict } from '@pixi/utils';
import atlasData from "../../../assets/images/spritesheet/symbols_and_ui_spritesheet.json";

export class SpriteSheetLoader {
    static spritesheet: Dict<Texture<Resource>>;

    private constructor() {}

    static async loadSpritesheet(): Promise<void> {
        const texture = await Assets.load("spritesheet");
        const spritesheet = new Spritesheet(
            BaseTexture.from("assets/images/spritesheet/symbols_and_ui_spritesheet.png"),
            // BaseTexture.from(Assets.get("spritesheet")),
            atlasData
        );
        SpriteSheetLoader.spritesheet = await spritesheet.parse();
        console.log("spritesheet loaded");
        console.log("spritesheet", SpriteSheetLoader.spritesheet);
    }

    public get SpriteSheet(): Dict<Texture<Resource>> {
        return SpriteSheetLoader.spritesheet;
    }
    // this should be called in the loader scene

    // is it possible to use ids in the json instead of the names?
}   
