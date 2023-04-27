import { Spritesheet, BaseTexture, Resource, Texture } from "pixi.js";
import type { Dict } from '@pixi/utils';
import atlasData from "../../../assets/images/spritesheet/symbols_and_ui_spritesheet.json";

export class SpriteSheetLoader {
    static spritesheet: Dict<Texture<Resource>>;

    private constructor() {};

    static async loadSpritesheet(): Promise<void> {
        const spritsheetUrl = "assets/images/spritesheet/symbols_and_ui_spritesheet.png";
        const spritesheet = new Spritesheet( 
            BaseTexture.from(spritsheetUrl),
            atlasData,
        );
        SpriteSheetLoader.spritesheet = await spritesheet.parse();
        console.log("spritesheet loaded");
        console.log("spritesheet", SpriteSheetLoader.spritesheet);
    }

    public get SpriteSheet(): Dict<Texture<Resource>> {
        return SpriteSheetLoader.spritesheet;
    }
}   