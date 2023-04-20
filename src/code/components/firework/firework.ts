import { Container } from 'pixi.js';
import { config } from '../../common/config';
import { FireworkNode } from './fireworkNode';
import { Manager } from '../../common/manager';

export class Firework extends Container {

    constructor(
        parent: Container,
    ) {
        super();
        parent.addChild(this);
        const width = config.symbolSize * config.reelCount;
        this.x = width / 2;
        this.y = Manager.Height / 2;

        this.createFireworkNodes();

        setTimeout(() => {
            this.destroy();
        }, 9100);
    }

    private createFireworkNodes(): void {
        for (let i = 0; i < 16; i++) {
            new FireworkNode(this, i * 54); // was 150, was 320
        }
    }
}
