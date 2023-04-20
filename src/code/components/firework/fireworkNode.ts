import { Sprite, Texture, Ticker, Container, DisplayObject } from "pixi.js";
import { Emitter, upgradeConfig } from '@pixi/particle-emitter';
import fireworkConfig from './emmiter.json';
import {gsap} from 'gsap';
import {config} from '../../common/config';

export class FireworkNode extends Container{

    private delay: number;

    constructor(
        parent: Container,
        delay: number = 320,
        ) {
        super();
        parent.addChild(this);
        const width = config.symbolSize * config.reelCount;
        const height = config.symbolSize * config.reelCount;

        this.delay = delay;

        const texture = Texture.from('assets/images/symbols/symbol4.png');
    
        const sprite = new Sprite(texture);
        sprite.width = 0;
        sprite.height = 0;
        sprite.anchor.set(0.5, 0.5);
        // sprite.visible = false;

        this.addChild(sprite);

        console.log(this.toGlobal(this.position));

        const emmiter = new Emitter(
            this,
            upgradeConfig(fireworkConfig, texture),
        );

        console.log(emmiter);

        const ticker = Ticker.shared;
    
        setTimeout(() => {
            ticker.add((delta) => {
                emmiter.update(delta);
            });
            emmiter.emit = true;
            sprite.visible = false;
        }, this.delay);

        const randomX = Math.random() * 900 - 450;
        const randomY = Math.random() * 900 - 450;

        // normalise vector of randomX and randomY
        const magnitude = Math.sqrt(randomX * randomX + randomY * randomY);
        const normalisedX = randomX / magnitude * 300;
        const normalisedY = randomY / magnitude * 300;
        console.log(normalisedX, normalisedY);

        gsap.to(this, { x: normalisedX*6, y: normalisedY*6, duration: 6, ease: 'none' });
        gsap.to(this, { rotation: randomX/100 - 4, duration: delay/1000, ease: 'none' });
        gsap.to(sprite, { width: 15, height: 30, duration: delay/1000, ease: 'none' });

        setTimeout(() => {
            this.destroy();
        }, 6100);
    }

}