import { FakeAPI } from "../backend/fakeAPI";
import { InitResponse, UpdateResponse, ErrorResponse } from "../common/types";
import { BackendReelCalculator } from "../backend/backendReelCalculator";

const testSymbols1 = [
    [1, 3, 3, 2],
    [1, 2, 6, 5],
    [1, 4, 8, 11],
    [1, 3, 10, 12],
]

const testSymbols2 = [
    [4, 4, 4, 4],
    [1, 1, 1, 1],
    [2, 2, 2, 2],
    [3, 3, 3, 3],
]

describe("FakeAPI", () => {
    it("should return a valid response to an initRequest", () => {
        const api = new FakeAPI();
        const response = api.sendRequest({ action: "init" });
        expect(response).toBeDefined();

        response.then((value) => {
            expect(value).toBeDefined();
            expect(value.action).toBe("init");
            
            const initResponse = value as InitResponse;

            expect(initResponse.symbols).toBeDefined();
            expect(initResponse.symbols.length).toBeGreaterThan(0);
            expect(initResponse.symbols[0].length).toBeGreaterThan(0);

            expect(initResponse.balance).toBeDefined();

            const symbols = initResponse.symbols;
            const symbol = symbols[0][0];

            expect(symbol).toBeGreaterThanOrEqual(1);
        });
    });

    it("should return a valid response to a update (spin) request", () => {
        const api = new FakeAPI();
        const response = api.sendRequest({ action: "spin", bet: 1 });
        expect(response).toBeDefined();

        response.then((value) => {
            expect(value).toBeDefined();
            expect(value.action).toBe("update");

            const updateResponse = value as UpdateResponse;

            expect(updateResponse["spin-result"]).toBeDefined();

            const spinResult = updateResponse["spin-result"];
            expect(spinResult.symbols).toBeDefined();
            expect(spinResult.symbols.length).toBeGreaterThan(0);
            expect(spinResult.symbols[0].length).toBeGreaterThan(0);

            expect(updateResponse.balance).toBeDefined();
        });

    });

    it ("should return a valid response to a spin request with a bet greater than the balance", () => {
        const api = new FakeAPI();
        const response = api.sendRequest({ action: "spin", bet: 1000000 });
        expect(response).toBeDefined();

        response.then((value) => {
            expect(value).toBeDefined();
            expect(value.action).toBe("error");

            const errorResponse = value as ErrorResponse;
            expect(errorResponse.error).toBe("Not enough money");
        });
    });

    it ("should return a valid response to a spin request with a bet less than 0", () => {
        const api = new FakeAPI();
        const response = api.sendRequest({ action: "spin", bet: -1 });
        expect(response).toBeDefined();

        response.then((value) => {
            expect(value).toBeDefined();
            expect(value.action).toBe("error");

            const errorResponse = value as ErrorResponse;
            expect(errorResponse.error).toBe("Bet must be greater than 0");
        });
    });

    it ("should return a valid response to a spin request with a bet of 0", () => {
        const api = new FakeAPI();
        const response = api.sendRequest({ action: "spin", bet: 0 });
        expect(response).toBeDefined();

        response.then((value) => {
            expect(value).toBeDefined();
            expect(value.action).toBe("error");
            const errorResponse = value as ErrorResponse;
            expect(errorResponse.error).toBe("Bet must be greater than 0");
        });
    });

    describe("checkForWin", () => {
        it("should correctly identify when no win", () => {
            const getVisibleSymbolsMock = jest.fn(() => testSymbols2);
            BackendReelCalculator.prototype.getVisibleSymbols = getVisibleSymbolsMock;

            const api = new FakeAPI();
            const reelIndexes = [0, 0, 0, 0];
            const bet = 2;
            const win = api["checkForWin"](reelIndexes, bet);
            expect(win.totalCount).toBe(0);

            expect(getVisibleSymbolsMock).toHaveBeenCalledTimes(1);
        }); 

        it("should correctly identify win", () => {

            const getVisibleSymbolsMock = jest.fn(() => testSymbols1);
            BackendReelCalculator.prototype.getVisibleSymbols = getVisibleSymbolsMock;

            const api = new FakeAPI();
            const reelIndexes = [0, 0, 0, 0];
            const bet = 2;
            const win = api["checkForWin"](reelIndexes, bet);

            expect(win.totalCount).toBeDefined();
            expect(win.totalCount).toBeGreaterThan(0);        

            expect(getVisibleSymbolsMock).toHaveBeenCalledTimes(1);
        });

        it("should return correct winning line indexes for a given set of reelIndexes", () => {
                
                const getVisibleSymbolsMock = jest.fn(() => testSymbols1);
                BackendReelCalculator.prototype.getVisibleSymbols = getVisibleSymbolsMock;
    
                const api = new FakeAPI();
                const reelIndexes = [0, 0, 0, 0];
                const bet = 2;
                const win = api["checkForWin"](reelIndexes, bet);
    
                expect(win.symbolRefs).toBeDefined();
                expect(win.symbolRefs.length).toBeGreaterThan(0);
                expect(win.symbolRefs[0].length).toBeGreaterThan(0);

                expect(win.symbolRefs[0][0].winningLineIndex).toBe(0);
                expect(win.symbolRefs[1][0].winningLineIndex).toBe(0);
                expect(win.symbolRefs[2][0].winningLineIndex).toBe(0);
                expect(win.symbolRefs[3][0].winningLineIndex).toBe(0);

                expect(win.symbolRefs[0][1].winningLineIndex).toBe(undefined);
                expect(win.symbolRefs[1][1].winningLineIndex).toBe(undefined);
                expect(win.symbolRefs[2][1].winningLineIndex).toBe(undefined);
                expect(win.symbolRefs[3][1].winningLineIndex).toBe(undefined);
    
                expect(getVisibleSymbolsMock).toHaveBeenCalledTimes(1);
            });
    });
});
