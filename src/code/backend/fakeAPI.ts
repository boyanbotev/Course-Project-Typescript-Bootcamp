import { BackendReelCalculator } from "./backendReelCalculator";
import { Request, Response, CheckReelResult, WinResult } from "../common/types";
import { config } from "../common/config";
import { slotSymbolMap, winMultiplierMap } from "../common/consts";

export class FakeAPI {
    private reelCount: number = config.reelCount;
    private reelLength: number = config.reelLength;
    private reelSize: number = config.reelSize;
    private reelCalculator: BackendReelCalculator;
    private balance: number = config.initialBalance;

    constructor() {
        this.reelCalculator = new BackendReelCalculator();
    }

    public async sendRequest(request: Request): Promise<Response> {
        let response: Response;

        switch (request.action) {
            case "init":
                response = {
                    "action": "init",
                    "symbols": this.reelCalculator.Reels,
                    "balance": this.balance,
                }
                break;
            case "spin":
                if (request.bet > this.balance) {
                    response = {
                        "action": "error",
                        "error": "Not enough money",
                    }
                } else {
                    const reelIndexes = this.getNewReelPositions();
                    const win = this.checkForWin(reelIndexes, request.bet);

                    const newBalance = this.balance - request.bet + win.totalCount;
                    this.balance = newBalance;

                    response = { // instead of passing reelIndexes, pass the visible symbols in a 2D array of SymbolReferences, which include symbol and the payline index
                        "action": "update",
                        "spin-result": {
                            "reelIndexes": reelIndexes,
                            "win": win.totalCount > 0 ? win.totalCount : undefined,
                            "winningSymbolIndexes": win.totalCount > 0 ? win.winningSymbolIndexes : undefined,
                        },
                        "balance": newBalance,
                    }
                }
                break;
            default:
                response = {
                    "action": "error",
                    "error": "Unknown action",
                }
                break;
        }
      
        return new Promise((resolve, reject) => {
            if (response) {
                resolve(response);
            } else {
                reject("No response");
            }
        });
    }

    private getNewReelPositions(): number[] {
        const positions: number[] = [];
        for (let i = 0; i < this.reelCount; i++) {
            positions.push(Math.floor(Math.random() * this.reelSize));
        }
        return positions;
    }

    // TDO: different symbols have different win multipliers
    private checkForWin(reelIndexes: number[], bet: number): WinResult { // test function
        const reels: number[][] = this.reelCalculator.getVisibleSymbols(reelIndexes);
        reels.forEach((reel) => {
            console.log("");
            reel.forEach((symbol) => {
                console.log(symbol);
                console.log(slotSymbolMap[symbol]);
            })
        })

        let totalCount = 0;
        let totalWinningSymbolIndexes: number[][] = [];

        for (let i = 0; i < reels[0].length; i++) {
            const symbol = reels[0][i];
            let count = 0;
            let fullReelIndex = 0;
            let winningSymbolIndexes: number[][] = [];

            let skip = false;
            for (let k = 0; k < i; k++) {
                if (reels[0][k] === symbol) {
                    skip = true;
                    break;
                }
            }
            if (skip && i > 0) {
                continue;
            }
            
            for (let j = 0; j < reels.length; j++) {
                const reel = reels[j];
                const result = this.checkReel(reel, symbol);
                if (result.count > 0) {
                    count += result.count;
                    fullReelIndex = j;
                    result.symbolIndex.forEach((symbolIndex) => {
                        winningSymbolIndexes.push([symbolIndex]);
                    });
                } else {
                    break;
                }
            }
            if (count >= 3 && fullReelIndex >= 2) {
                console.log("win");
                console.log("count:", count);
                count *= winMultiplierMap[symbol];
                totalCount += count;
                console.log("count * multiplier:", count);

                totalWinningSymbolIndexes = totalWinningSymbolIndexes.concat(winningSymbolIndexes);

                // TODO: add the winning symbols to 2d array
                // a 2d array of SymbolReference objects, where the object has a reel index and a payline index
            }
        }

        const winMultiplier = (bet * 1.4) / (this.reelLength + this.reelCount * 2);

        totalCount *= winMultiplier;
        console.log(totalCount);
        console.log(totalWinningSymbolIndexes);

        return {
            totalCount: totalCount,
            winningSymbolIndexes: totalWinningSymbolIndexes,    
        } satisfies WinResult;   
    }

    private checkReel(reel: number[], symbol: number): CheckReelResult {
        let count = 0;
        const winningSymbols: number[] = [];

        for (let i = 0; i < reel.length; i++) {
            if (reel[i] === symbol) {
                count++;
                winningSymbols.push(i);
            }
        }

        return {
            count: count,
            symbolIndex: winningSymbols,
        } satisfies CheckReelResult;
    }
}
