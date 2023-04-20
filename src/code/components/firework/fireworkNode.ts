import { Sprite, Texture, Ticker, Container, DisplayObject, Assets } from "pixi.js";
import { Emitter, upgradeConfig } from '@pixi/particle-emitter';
import fireworkConfig from './emmiter.json';
import {gsap} from 'gsap';
import {config} from '../../common/config';
import {SymbolBundle} from '../../common/types';

export class FireworkNode extends Container{

    private delay: number;
    private sprite: Sprite;

    constructor(
        parent: Container,
        delay: number = 320,
        ) {
        super();
        parent.addChild(this);
        const width = config.symbolSize * config.reelCount;
        const height = config.symbolSize * config.reelCount;

        this.delay = delay;

        this.inialize();
    }

    private async inialize(): Promise<void> {
        const symbolsBundle = await Assets.loadBundle("symbolsBundle") as SymbolBundle;
        // is this the right way?

        const texture = symbolsBundle[4];
    
        this.createFireworkNodeSprite(texture);
        
        const emmiter = new Emitter(
            this,
            upgradeConfig(fireworkConfig, texture),
        );

        const ticker = Ticker.shared;
    
        setTimeout(() => {
            this.startEmitter(ticker, emmiter);
        }, this.delay);

        const { normalisedX, normalisedY, randomX } = getRandomVector();

        this.moveNodeTween(normalisedX, normalisedY);
        this.rotateNodeTween(randomX);

        setTimeout(() => {
            this.destroy();
        }, 6100);
    }

    private rotateNodeTween(randomX: number) {
        gsap.to(this, { rotation: randomX / 100 - 4, duration: this.delay / 1000, ease: 'none' });
    }

    private moveNodeTween(normalisedX: number, normalisedY: number) {
        gsap.to(this, { x: normalisedX, y: normalisedY, duration: 6, ease: 'none' });
    }

    private startEmitter(ticker: Ticker, emmiter: Emitter) {
        ticker.add((delta) => {
            emmiter.update(delta);
        });
        emmiter.emit = true;
        this.sprite.visible = false;
    }

    private createFireworkNodeSprite(texture: Texture): void {
        const sprite = new Sprite(texture);
        sprite.width = 0;
        sprite.height = 0;
        sprite.anchor.set(0.5, 0.5);

        gsap.to(sprite, { width: 15, height: 30, duration: this.delay/1000, ease: 'none' });

        this.sprite = sprite;
        this.addChild(sprite);
    }
}

function getRandomVector() {
    const multiplier = 900;
    const randomX = Math.random() * multiplier - multiplier / 2;
    const randomY = Math.random() * multiplier - multiplier / 2;

    const magnitude = Math.sqrt(randomX * randomX + randomY * randomY);
    const normalizer = 1800 / magnitude;
    const normalisedX = randomX * normalizer;
    const normalisedY = randomY * normalizer;
    return { normalisedX, normalisedY, randomX };
}
