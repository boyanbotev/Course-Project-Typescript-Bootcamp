import { Dict } from "@pixi/utils";
import { Resource, Texture } from "pixi.js";

/**
 * Get all symbols from spritesheet
 * Use presence of "symbol" in key to filter out symbols
 */
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
/*
 * Replace string key with number
 */
function formatKey(key: string): number {
    const string = key.replace("symbol", "");
    return parseInt(string);
}
