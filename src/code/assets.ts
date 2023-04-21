import { ResolverManifest } from "pixi.js";

export const manifest: ResolverManifest = {
    bundles: [
        {
            name: "symbolsBundle",
            assets: {
                1: "assets/images/symbols/symbol1.png",     // princess
                2: "assets/images/symbols/symbol2.png",     // warrior
                3: "assets/images/symbols/symbol3_darker.png",     // и
                4: "assets/images/symbols/symbol4.png",     // jem
                5: "assets/images/symbols/symbol5.png",     // axe
                6: "assets/images/symbols/symbol6_darker2.png",     // P
                7: "assets/images/symbols/symbol7.png",     // horns
                8: "assets/images/symbols/symbol8.png",     // я
                9: "assets/images/symbols/symbol9_darker4.png",     // T
                10: "assets/images/symbols/symbol10_blue.png",   // X
                11: "assets/images/symbols/symbol11_darker2.png",   // C
                12: "assets/images/symbols/symbol12.png",   // king
                13: "assets/images/symbols/symbol13.png",   // H
                14: "assets/images/symbols/symbol14.png",   // emerald
                15: "assets/images/symbols/symbol15.png",   // dagger
                16: "assets/images/symbols/symbol16.png",   // square
                17: "assets/images/symbols/symbol17.png",   // B
            }
        },
        {
            name: "uiBundle",
            assets: {
                "spinButton": "assets/images/ui/spin.png",
                "spinButtonHover": "assets/images/ui/spin_hover2.png",
            }
        },
        {
            name: "backgroundBundle",
            assets: {
                "background": "assets/images/background/background.png",
                "frame": "assets/images/background/frame.jpg",
            }
        },
        {
            name: "particlesBundle",
            assets: {
                "particle": "assets/images/particle/particle.png",
            }
        },

    ]
};