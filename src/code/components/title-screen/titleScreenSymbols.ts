import { Container, Assets, BlurFilter } from "pixi.js";
import { Background } from "../background/background";
import { Manager } from "../../common/manager";
import { gsap } from "gsap";
import { SymbolBundle } from "../../common/types";
import { CustomEase } from "gsap/all";

export class TitleScreenSymbols extends Container {
    private readonly symbols: Background[] = [];

    private symbolAnimation: gsap.core.Timeline;

    constructor(parent: Container) {
        super();
        parent.addChild(this);
        this.createSymbols();
    }

    private async createSymbols(){
        const yBasis = Manager.Height / 2.5;  
        const size = 210;
    
        const symbolsBundle = await Assets.loadBundle("symbolsBundle") as SymbolBundle;
        const textures = [symbolsBundle[14], symbolsBundle[1], symbolsBundle[4]];

        for (let i = 0; i < 3; i++) {
            const symbol = new Background(size, size, textures[i], this);
            symbol.position.x = Manager.Width / 2 - 200 + 200 * i;
            symbol.position.y = yBasis;
            this.symbols.push(symbol);
        }
    
        const tl = gsap.timeline({repeat: -1, repeatDelay: 0.5});
        this.symbols.forEach((symbol) => {
            tl.to(symbol, { y: yBasis - 5, duration: 0.2 });
            tl.to(symbol, { y: yBasis, duration: 0.2 });
        });
    
        this.symbolAnimation = tl;
    }

    public tweenAway(duration: number) {
        this.symbolAnimation.pause();

        this.initializeBlur(duration);
    
        const intitialLeftOffset = 90;
        const finalXOffset = 1300;
    
        gsap.registerPlugin(CustomEase);
        const ease = CustomEase.create("custom", "M0,0,C0.672,0.054,0.74,0.31,0.792,0.388,0.846,0.469,0.896,0.668,1,1");
    
        this.symbols.forEach((symbol) => {
            reboundAndTweenAway(symbol);
        });

        function reboundAndTweenAway(symbol: Background) {
            const tl = gsap.timeline();
            tl.to(symbol, { x: symbol.position.x - intitialLeftOffset, ease: ease, duration: duration / 5 });
            tl.to(symbol, { x: symbol.position.x + finalXOffset, duration: duration + 0.2 });
        }
    }

    private initializeBlur(duration: number) {
        const blurFilter = new BlurFilter();
        blurFilter.blurX = 0;
        blurFilter.blurY = 0;

        setTimeout(() => {
            this.blur(blurFilter, duration);
        }, duration / 5 * 1000);
    }

    private blur(blurFilter: BlurFilter, duration: number) {
        this.symbols.forEach((symbol) => {
            symbol.filters = [blurFilter];
        });
        gsap.to(blurFilter, { blurX: 120, delay: duration / 14, duration: duration / 5 });
    }
}
