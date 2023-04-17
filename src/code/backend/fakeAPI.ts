import { BackendReelCalculator } from "./backendReelCalculator";
import { Request, Response } from "../common/types";
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

                    const newBalance = this.balance - request.bet + win;
                    this.balance = newBalance;

                    response = {
                        "action": "update",
                        "spin-result": {
                            "reelIndexes": reelIndexes,
                            "win": win,
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
    private checkForWin(reelIndexes: number[], bet: number): number { // test function
        const reels: number[][] = this.reelCalculator.getVisibleSymbols(reelIndexes);
        reels.forEach((reel) => {
            console.log("");
            reel.forEach((symbol) => {
                console.log(symbol);
                console.log(slotSymbolMap[symbol]);
            })
        })

        let totalCount = 0;
        for (let i = 0; i < reels[0].length; i++) {
            const symbol = reels[0][i];
            let count = 0;
            let fullReelIndex = 0;

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
                if (result > 0) {
                    count += result;
                    fullReelIndex = j;
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

                // TODO: add the winning symbols to some array, to highlight them
                // how are the winning symbols referenced?

                // by the reel and position on that reel?
                // a 2d array with an array for each reel
                // eg. [[0], [0], [1], [0, 2,]] would mean that the first reel has a winning symbol at position 0
            }
        }

        const winMultiplier = (bet * 1.4) / (this.reelLength + this.reelCount * 2);

        totalCount *= winMultiplier;
        console.log(totalCount);
        return totalCount;        
    }

    private checkReel(reel: number[], symbol: number): number {
        let count = 0;
        reel.forEach((reelSymbol) => {
            if (reelSymbol === symbol) {
                count++;
            }
        })
        return count;
    }
}
