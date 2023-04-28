import { Spritesheet, BaseTexture, Resource, Texture } from "pixi.js";
import type { Dict } from '@pixi/utils';
import atlasData from "../../../assets/images/spritesheet/symbols_and_ui_spritesheet.json";

export class SpriteSheetLoader {
    static spritesheet: Dict<Texture<Resource>>;

    private constructor() {};

    static async loadSpritesheet(): Promise<void> {
        const spritesheetUrl = "assets/images/spritesheet/symbols_and_ui_spritesheet.png";

        const spritesheet = new Spritesheet( 
            BaseTexture.from(spritesheetUrl),
            atlasData,
        );
        SpriteSheetLoader.spritesheet = await spritesheet.parse();
    }

    public get SpriteSheet(): Dict<Texture<Resource>> {
        return SpriteSheetLoader.spritesheet;
    }
}   