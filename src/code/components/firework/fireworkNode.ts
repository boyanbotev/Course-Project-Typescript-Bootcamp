import { Sprite, Texture, Ticker, Container } from "pixi.js";
import { Emitter, upgradeConfig } from '@pixi/particle-emitter';
import { gsap } from 'gsap';
import fireworkConfig from './emmiter.json';
import { SpriteSheetLoader } from "../../common/assets/spriteSheetLoader";

export class FireworkNode extends Container{
    private readonly delay: number;
    private sprite: Sprite;
    private currentAnimations: gsap.core.Tween[] = [];

    constructor(
        parent: Container,
        delay: number = 320, 
        ) {
        super();
        parent.addChild(this);

        this.delay = delay;

        this.inialize();
    }

    private async inialize(): Promise<void> {
        const spritesheet = SpriteSheetLoader.spritesheet;
        const texture = spritesheet["particle"];
    
        this.createFireworkNodeSprite(texture);
        
        this.createEmmiter(texture);

        this.moveNodeTween();

        setTimeout(() => {
            this.destroySelf();
        }, 6100);
    }

    private createEmmiter(texture: any) {
        const emmiter = new Emitter(
            this,
            upgradeConfig(fireworkConfig, texture)
        );

        const ticker = Ticker.shared;

        setTimeout(() => {
            this.startEmitter(ticker, emmiter);
        }, this.delay);
    }

    /*
     * Move node randomly away from center of firework
     */
    private moveNodeTween() {
        const { normalisedX, normalisedY } = getRandomVector();

        const anim = gsap.to(this, { x: normalisedX, y: normalisedY, duration: 6, ease: 'none' });
        this.currentAnimations.push(anim);
    }

    private startEmitter(ticker: Ticker, emmiter: Emitter) {
        ticker.add((delta) => {
            emmiter.update(delta);
        });
        emmiter.emit = true;
        this.sprite.visible = false;
    }

    /**
     * Creates sprite for the firework node and increase it in size until it reaches 20x20
     * Then it will be destroyed and will emit particles
     */
    private createFireworkNodeSprite(texture: Texture): void {
        const sprite = new Sprite(texture);
        sprite.width = 0;
        sprite.height = 0;
        sprite.anchor.set(0.5, 0.5);

        this.increaseSpriteSize(sprite);

        this.sprite = sprite;
        this.addChild(sprite);
    }

    private increaseSpriteSize(sprite: Sprite) {
        const anim = gsap.to(sprite, { width: 20, height: 20, duration: this.delay / 1000, ease: 'none' });
        this.currentAnimations.push(anim);
    }

    private destroySelf() {
        this.currentAnimations.forEach(anim => anim.kill());
        this.destroy();
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
    return { normalisedX, normalisedY };
}
