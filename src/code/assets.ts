import { ResolverManifest } from "pixi.js";

export const manifest: ResolverManifest = {
    bundles: [
        {
            name: "symbolsBundle",
            assets: { // TODO: Refactor with number as indexes
                "axe": "assets/images/symbols/symbol1.png",
                "princess": "assets/images/symbols/symbol2.png",
                "emerald": "assets/images/symbols/symbol3.png",
                "jem": "assets/images/symbols/symbol4.png",
                "square": "assets/images/symbols/symbol5.png",
                "dagger": "assets/images/symbols/symbol6.png",
                "warrior": "assets/images/symbols/symbol7.png",
                "king": "assets/images/symbols/symbol8.png",
                "horns": "assets/images/symbols/symbol9.png",
                "B": "assets/images/symbols/symbol10.png",
                "C": "assets/images/symbols/symbol11.png",
                "T": "assets/images/symbols/symbol12.png",
                "X": "assets/images/symbols/symbol13.png",
                "P": "assets/images/symbols/symbol14.png",
                "H": "assets/images/symbols/symbol15.png",
                "и": "assets/images/symbols/symbol16.png",
                "я": "assets/images/symbols/symbol17.png",
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