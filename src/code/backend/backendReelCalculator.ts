import { SlotSymbol } from "../common/types"
import { config } from "../common/config"

// TODO: name consistency with casing

export class BackendReelCalculator {
    private reelCount: number = config.reelCount;
    private reelLength: number = config.reelLength; // incorporate into calculations
    private reelSize: number = config.reelSize;

    private reels: SlotSymbol[][] = [];

    constructor() {
        this.reels = this.createReels();
    }

    /**
     * Randomly create reels of size 20 using each symbol at least once
     */
    private createReels(): SlotSymbol[][] {

        const reels: SlotSymbol[][] = [];
        for (let i = 0; i < this.reelCount; i++) {
            reels.push(createReel(this.reelSize));
        }

        function createReel(reelSize: number) {
            const symbols: SlotSymbol[] = ["T", "jem", "princess", "dagger", "king", "axe", "H", "warrior", "C", "B", "horns", "square", "emerald", "X", "P", "и", "я"];
            // TODO: Get slotsymbol array from SlotSymbol type

            const reel: SlotSymbol[] = [];
            let randomIndex: number;
            let randomSymbol: SlotSymbol;

            // Generate random symbols for extra spaces in reel
            for (let i = 0; i < reelSize-symbols.length; i++) {
                randomIndex = Math.floor(Math.random() * symbols.length);
                randomSymbol = symbols[randomIndex];
                reel.push(randomSymbol);
            }

            // Add all symbols in random order
            while (symbols.length > 0) {
                randomIndex = Math.floor(Math.random() * symbols.length);
                randomSymbol = symbols[randomIndex];
                reel.push(randomSymbol);
                symbols.splice(randomIndex, 1);
            }
            return reel;
        }
        return reels;
    }

    /** 
     * Should return the symbols on the reels starting at the reelIndexes
     * TODO: Separate visible reelLength (horizontal) from visible reelHeight (vertical)
     */
    public getVisibleSymbols(reelIndexes: number[]): SlotSymbol[][] {     // test this function?
        const visibleReels: SlotSymbol[][] = [];
        for (let i = 0; i < reelIndexes.length; i++) {
            const symbols: SlotSymbol[] = [];
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
