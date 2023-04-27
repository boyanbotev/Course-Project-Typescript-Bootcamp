import { BackendReelCalculator } from "../backend/backendReelCalculator";
import { config } from "../common/config";

const testReels = [
    [1, 2, 3, 4, 5],
    [2, 3, 4, 5, 1],
    [3, 4, 5, 1, 2],
    [4, 5, 1, 2, 3],
];

describe("BackendReelCalculator", () => {
    it("should correctly return the visible symbols for given reel indexes", () => {

        const createReelsMock = jest.fn(() => testReels);
        BackendReelCalculator.prototype["createRandomReels"] = createReelsMock;
        
        const backendReelCalculator = new BackendReelCalculator();

        if (config.testMode) {
            backendReelCalculator["reels"] = testReels;
        }

        const visibleReelLength = 4;
        const visibleSymbols = backendReelCalculator.getVisibleSymbols([0, 0, 0, 0], visibleReelLength);
        console.log(visibleSymbols);

        expect(visibleSymbols.length).toBe(visibleReelLength);

        expect(visibleSymbols[0][0]).toBe(1);
        expect(visibleSymbols[1][0]).toBe(2);
        expect(visibleSymbols[2][0]).toBe(3);
        expect(visibleSymbols[3][0]).toBe(4);
    });   
});