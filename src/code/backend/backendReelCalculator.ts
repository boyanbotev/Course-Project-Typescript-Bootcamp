import { config } from "../common/config"

// TODO: name consistency with casing

export class BackendReelCalculator {
    private reelCount: number = config.reelCount;
    private reelLength: number = config.reelLength; // incorporate into calculations
    private reelSize: number = config.reelSize;

    private reels: number[][] = [];

    constructor() {
        this.reels = this.createReels();
    }

    /**
     * Randomly create reels of size 20 using each symbol at least once
     */
    private createReels(): number[][] {

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
            randomIndex = Math.floor(Math.random() * symbolLength +1); // +1 because of 1 indexed keys
            reel.push(randomIndex);
        }

        // Add all symbols in random order
        while (symbolLength > 0) {
            randomIndex = Math.floor(Math.random() * symbolLength + 1);
            reel.push(randomIndex);
            symbolLength--;
        }
        return reel;
    }
    return reels;
}

    /** 
     * Should return the symbols on the reels starting at the reelIndexes
     * TODO: Separate visible reelLength (horizontal) from visible reelHeight (vertical)
     */
    public getVisibleSymbols(reelIndexes: number[]): number[][] {     // test this function?
        const visibleReels: number[][] = [];
        for (let i = 0; i < reelIndexes.length; i++) {
            const symbols: number[] = [];
            for ( let j = 0; j < this.reelLength; j++ ) { // using reelIndexes.length as reelHeight forces the reels to be square

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
