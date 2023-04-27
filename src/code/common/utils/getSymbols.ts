import { Dict } from "@pixi/utils";
import { Resource, Texture } from "pixi.js";

export function getSymbols(sprites: Dict<Texture<Resource>>) {
    const symbolKeys = Object.keys(sprites).filter((key) => {
        return key.includes("symbol");
    });

    const symbols: Dict<Texture<Resource>> = {};
    symbolKeys.forEach((key) => {
        symbols[formatKey(key)] = sprites[key];
    });
    return symbols;
}

function formatKey(key: string): number {
    const string = key.replace("symbol", "");
    return parseInt(string);
}
