import { BackendReelCalculator } from "./backendReelCalculator";
import { Request, Response, CheckReelResult, WinResult, SymbolReference } from "../common/types";
import { config } from "../common/config";
import { winMultiplierMap } from "../common/consts";

export class FakeAPI {
    private readonly reelCount: number = config.reelCount;
    private readonly reelLength: number = config.reelLength;
    private readonly reelSize: number = config.reelSize;
    private readonly reelCalculator: BackendReelCalculator;
    private balance: number = config.initialBalance;

    constructor() {
        this.reelCalculator = new BackendReelCalculator();
    }

    public async sendRequest(request: Request): Promise<Response> {
        let response: Response;

        switch (request.action) {
            case "init":
                // Get tops of reels for intial positions, with + 1 for extra symbol in reel that we don't see
                const reelIndexes = Array(this.reelCount).fill(0);
                response = {
                    "action": "init",
                    "symbols": this.reelCalculator.getVisibleSymbols(reelIndexes, this.reelLength + 1),
                    "balance": this.balance,
                }
                break;
            case "spin":
                if (request.bet > this.balance) {
                    response = {
                        "action": "error",
                        "error": "Not enough money",
                    }
                } else if (request.bet <= 0) {
                    response = {
                        "action": "error",
                        "error": "Bet must be greater than 0",
                    }
                }   else {
                    const reelIndexes = this.getNewReelPositions();
                    const win = this.checkForWin(reelIndexes, request.bet);

                    const newBalance = this.balance - request.bet + win.totalCount;
                    this.balance = newBalance;

                    response = { 
                        "action": "update",
                        "spin-result": {
                            "win": win.totalCount > 0 ? win.totalCount : undefined,
                            "symbols": win.symbolRefs,
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

    private checkForWin(reelIndexes: number[], bet: number): WinResult {
        const reels: number[][] = this.reelCalculator.getVisibleSymbols(reelIndexes, this.reelLength);

        let totalCount = 0;
        let paylineCount = 0;

        const symbolRefs = reels.map((reel) => {
            return reel.map((symbol) => {
                return {
                    symbolId: symbol,
                    winningLineIndex: undefined,
                } satisfies SymbolReference;
            });
        });

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
                        const winningSymbolIndex: number[] = [j, symbolIndex];
                        winningSymbolIndexes.push(winningSymbolIndex);
                    });
                } else {
                    break;
                }
            }
            if (count >= 3 && fullReelIndex >= 2) {
                count *= winMultiplierMap[symbol];
                totalCount += count;

                winningSymbolIndexes.forEach((winningSymbolIndex) => {
                    symbolRefs[winningSymbolIndex[0]][winningSymbolIndex[1]].winningLineIndex = paylineCount;
                });
                paylineCount++;
            }
        }

        const boardSize = this.reelLength * this.reelCount;

        const winMultiplier = (bet * (Math.max(10 + (35-boardSize)), 10)) / (boardSize * 9.5);

        const finalCount = roundToTwoDecimalPlaces(totalCount * winMultiplier);

        return {
            totalCount: finalCount,  
            symbolRefs: symbolRefs,

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

function roundToTwoDecimalPlaces(num: number): number {
    return Math.round(num * 100) / 100;
}
