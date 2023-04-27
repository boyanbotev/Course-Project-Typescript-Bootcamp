import { ResolverManifest } from "pixi.js";

export const manifest: ResolverManifest = {
    bundles: [
        {
            name: "backgroundBundle",
            assets: {
                "background": "assets/images/background/background.png",
                "frame": "assets/images/background/frame.jpg",
            }
        },
        {
            name: "musicBundle",
            assets: {
                "music": "assets/audio/music.mp3",
            }
        }
    ]
};
