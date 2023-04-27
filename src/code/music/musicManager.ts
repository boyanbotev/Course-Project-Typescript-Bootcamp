import { Sound, filters } from "@pixi/sound";
import { Assets } from "pixi.js";
import { SlotMachineObserver } from "../common/types";
import { gsap } from "gsap";

type MusicBundle = {
    music: Sound;
};

export class MusicManager implements SlotMachineObserver { // you also have to add this to the slot machine
    private music: Sound;

    constructor() {
    }

    public async playMusic(): Promise<void> {

        this.music = Sound.from("music");

        Assets.load("music").then((music) => {
            this.music = music;
            this.music.play();
            this.music.loop = true;
            // add low pass filter
            this.music.filters = [
                new filters.EqualizerFilter(25, 25, 17, 19, 17, -2, -20, -40, -40, -26),
            ];
        }); // WHY does this work? I don't understand why I can't just use the music from the manifest

        setTimeout(() => {
            this.fadeOutFilters();
        }, 10000);
    }

    onWin() {

    }

    onBalanceUpdate(balance: number): void {
        
    }

    onSpinComplete(): void {
        
    }

    onSpin() {
        console.log("spin");
        this.fadeOutFilters();
    }

    public fadeOutFilters(): void {
        
    }
}