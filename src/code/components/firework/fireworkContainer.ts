import { Container } from "pixi.js";
import { config } from "../../common/config";
import { framePadding } from "../../common/consts";
import { Manager } from "../../common/manager";
import { SlotMachine, SlotMachineObserver } from "../../common/types";
import { Firework } from "./firework";
import { PIXISlotMachine } from "../slots/slotMachine";
import { Graphics } from "pixi.js";

export class FireWorkContainer extends Container implements SlotMachineObserver {
    constructor(parent: Container, slotMachine: SlotMachine ) {
        super();
        parent.addChild(this);

        const containerWidth = config.reelCount * config.symbolSize + framePadding;
        this.pivot.x = containerWidth / 2;

        this.y = -(config.symbolSize-config.topMargin);

        this.x = Manager.Width/2;

        slotMachine.addObserver(this);

        this.createMask();
    }

    private createMask() {
        const graphics = new Graphics();
        graphics.beginFill(0x000000);
        const leftAdjust = 20;
        const rightAdjust = 40;
        graphics.drawRect(leftAdjust, config.symbolSize, config.reelCount * config.symbolSize + framePadding - (leftAdjust + rightAdjust), config.symbolSize * config.reelLength);
        graphics.endFill();

        this.addChild(graphics);
        this.mask = graphics;
    }

    onWin(): void {
        new Firework(this);
    }

    onSpin(): void {      
    }

    onSpinComplete(): void {   
    }

    onBalanceUpdate(balance: number): void {
    }
}
