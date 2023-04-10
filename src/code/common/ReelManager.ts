import { SlotSymbol } from "./types"

// TODO: name consistency with casing

export interface Reel {
    symbols: SlotSymbol[];
}

export class ReelManager {
    private reels: Reel[] = [];

    constructor() {
        this.reels = this.createReels();
    }

    /**
     * Randomly create reels of size 20 using each symbol at least once
     */
    private createReels(reelNumber: number = 4, reelSize: number = 20): Reel[] {

        const reels: Reel[] = [];
        for (let i = 0; i < reelNumber; i++) {
            reels.push({symbols: createReel()});
        }

        function createReel() {
            const symbols: SlotSymbol[] = ["T", "jem", "princess", "dagger", "king", "axe", "H", "warrior", "C", "B", "horns", "square", "emerald", "X", "P", "и", "я"];
            // TODO: Get slotsymbol aray from SlotSymbol type

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

        console.log(reels);
        return reels;
    }

    // should return the symbols on the reels at the given positions
    public getSymbolsAtPositions(positions: number[]): Reel[] {
        const reels: Reel[] = [{symbols: ["T", "jem", "princess", "dagger"]}];
        return reels;
    }
}
