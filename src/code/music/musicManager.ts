import { Sound, filters } from "@pixi/sound";
import { Assets } from "pixi.js";
import { gsap } from "gsap";
import { SlotMachineObserver, SlotMachine } from "../common/types";

export class MusicManager implements SlotMachineObserver {   
    private music: Sound;
    private currentTransition: gsap.core.Tween;

    constructor(
        slotMachine: SlotMachine,
    ) {
        slotMachine.addObserver(this);
        this.playMusic();
    }

    public async playMusic(): Promise<void> {
        Assets.load("music").then((music) => {
            this.music = music;
            this.music.play();
            this.music.loop = true;

            // Add low pass filter
            this.music.filters = [
                new filters.EqualizerFilter(0, 0, 0, 0, 0, -2, -20, -40, -40, -26),
            ];
        });
    }

    onWin() {
    }

    onBalanceUpdate(balance: number): void {
    }

    onSpinComplete(): void {
        this.fadeInFilters();
    }

    onSpin() {
        this.fadeOutFilters();
    }

    private fadeOutFilters(): void {
        if (this.currentTransition) this.currentTransition.kill();
        const filter = this.music.filters[0] as filters.EqualizerFilter;
        this.currentTransition = gsap.to(filter, { f32: 0, f64: 0, f125: 0, f250: 0, f500: 0, f1k: 0, f2k: 0, f4k: 0, f8k: 0, f16k: 0, duration: 1 });
    }

    private fadeInFilters(): void {
        if (this.currentTransition) this.currentTransition.kill();
        const filter = this.music.filters[0] as filters.EqualizerFilter;
        this.currentTransition = gsap.to(filter, { f32: 0, f64: 0, f125: 0, f250: 0, f500: 0, f1k: -2, f2k: -20, f4k: -40, f8k: -40, f16k: -26, delay: 1, duration: 4 });
    }
}
