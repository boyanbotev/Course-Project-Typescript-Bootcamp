import { config } from "../common/config";
import { testReels } from "../common/consts";

export class BackendReelCalculator {
    private readonly reelCount: number = config.reelCount;
    private readonly reelSize: number = config.reelSize;

    private reels: number[][] = [];

    constructor() {
        if (!config.testMode) {
            this.reels = this.createRandomReels();
        } else {
            this.reels = testReels;
        }
    }

    /**
     * Randomly create reels of size 20 using each symbol at least once
     */
    private createRandomReels(): number[][] {

        const reels: number[][] = [];
        for (let i = 0; i < this.reelCount; i++) {
            reels.push(createReel(this.reelSize));
        }

    function createReel(reelSize: number) {
        const reel: number[] = [];
        let randomIndex: number;
        let symbolLength = 17;

        // Generate random symbols for extra spaces in reel
        for (let i = 0; i < reelSize-symbolLength; i++) {
            randomIndex = Math.floor(Math.random() * symbolLength +1); // +1 because of 1-indexed keys
            reel.push(randomIndex);
        }

        // Add all symbols in random order
        const indexes: number[] = [];
            for (let i = 1; i <= symbolLength; i++) {
                indexes.push(i);
            }

        while (indexes.length > 0) {
            randomIndex = Math.floor(Math.random() * indexes.length);
            reel.push(indexes[randomIndex]);
            indexes.splice(randomIndex, 1);
        }
        return reel;
    }
    return reels;
}

    /** 
     * Should return the symbols on the reels starting at the reelIndexes
     * TODO: Separate visible reelLength (horizontal) from visible reelHeight (vertical)
     */
    public getVisibleSymbols(reelIndexes: number[], reelLength: number): number[][] {
        const visibleReels: number[][] = [];
        for (let i = 0; i < reelIndexes.length; i++) {
            const symbols: number[] = [];
            for ( let j = 0; j < reelLength; j++ ) {

                let index = reelIndexes[i]+j;

                if (index >= this.reels[i].length) {
                    index = index - this.reels[i].length;
                }

                symbols.push(this.reels[i][index]);
            }

            visibleReels.push(symbols);
        }
        return visibleReels;
    }

    public get Reels() {
        return this.reels;
    }
}
