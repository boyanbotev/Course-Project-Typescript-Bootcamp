import { Sound, filters } from "@pixi/sound";
import { Assets } from "pixi.js";
import { SlotMachineObserver, SlotMachine } from "../common/types";
import { gsap } from "gsap";

type MusicBundle = {
    music: Sound;
};

export class MusicManager implements SlotMachineObserver { // you also have to add this to the slot machine
    private music: Sound;

    constructor(
        slotMachine: SlotMachine,
    ) {
        slotMachine.addObserver(this);
    }

    public async playMusic(): Promise<void> {

        this.music = Sound.from("music");

        Assets.load("music").then((music) => {
            this.music = music;
            this.music.play();
            this.music.loop = true;
            // add low pass filter
            this.music.filters = [
                new filters.EqualizerFilter(0, 0, 0, 0, 0, -2, -20, -40, -40, -26),
            ];
        }); // WHY does this work? I don't understand why I can't just use the music from the manifest
    }

    onWin() {

    }

    onBalanceUpdate(balance: number): void {
        
    }

    onSpinComplete(): void {
        console.log("spin complete");
        this.fadeInFilters();
    }

    onSpin() {
        console.log("spin");
        this.fadeOutFilters();
    }

    private fadeOutFilters(): void {
        const filter = this.music.filters[0] as filters.EqualizerFilter;
        gsap.to(filter, { f32: 0, f64: 0, f125: 0, f250: 0, f500: 0, f1k: 0, f2k: 0, f4k: 0, f8k: 0, f16k: 0, duration: 1 });
    }

    private fadeInFilters(): void {
        const filter = this.music.filters[0] as filters.EqualizerFilter;
        gsap.to(filter, { f32: 0, f64: 0, f125: 0, f250: 0, f500: 0, f1k: -2, f2k: -20, f4k: -40, f8k: -40, f16k: -26, delay: 1, duration: 4 });
    }

}