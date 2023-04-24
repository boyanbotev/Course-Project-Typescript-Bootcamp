import { Container } from 'pixi.js';
import { config } from '../../common/config';
import { FireworkNode } from './fireworkNode';
import { Manager } from '../../common/manager';
import { framePadding } from '../../common/consts';

export class Firework extends Container {

    constructor(
        parent: Container,
    ) {
        super();
        parent.addChild(this);
        const width = config.symbolSize * config.reelCount + framePadding;
        this.x = width / 2;
        this.y = Manager.Height / 2;

        this.createFireworkNodes();

        setTimeout(() => {
            this.destroy();
        }, 9100);
    }

    private createFireworkNodes(): void {
        for (let i = 0; i < 22; i++) { // this number related to win size?
            new FireworkNode(this, i * 54);
        }
    }
} 