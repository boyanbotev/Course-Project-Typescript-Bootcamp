import { ResolverManifest } from "pixi.js";

export const manifest: ResolverManifest = {
    bundles: [
        {
            name: "symbolsBundle",
            assets: { // TODO: Refactor with number as indexes
                "princess": "assets/images/symbols/symbol1.png",
                "warrior": "assets/images/symbols/symbol2.png",
                "и": "assets/images/symbols/symbol3.png",
                "jem": "assets/images/symbols/symbol4.png",
                "axe": "assets/images/symbols/symbol5.png",
                "P": "assets/images/symbols/symbol6.png",
                "horns": "assets/images/symbols/symbol7.png",
                "я": "assets/images/symbols/symbol8.png",
                "T": "assets/images/symbols/symbol9.png",
                "X": "assets/images/symbols/symbol10.png",
                "C": "assets/images/symbols/symbol11.png",
                "king": "assets/images/symbols/symbol12.png",
                "H": "assets/images/symbols/symbol13.png",
                "emerald": "assets/images/symbols/symbol14.png",
                "dagger": "assets/images/symbols/symbol15.png",
                "square": "assets/images/symbols/symbol16.png",
                "B": "assets/images/symbols/symbol17.png",
            }
        },
        {
            name: "uiBundle",
            assets: {
                "spinButton": "assets/images/ui/spin.png",
            }
        },
    ]
};