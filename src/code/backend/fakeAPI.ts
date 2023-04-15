import { BackendReelCalculator } from "./backendReelCalculator";
import { Request, Response, SlotSymbol } from "../common/types";
import { config } from "../common/config";

export class FakeAPI {
    private reelCount: number = config.reelCount;
    private reelLength: number = config.reelLength; // incorporate into calculations 
    private reelSize: number = config.reelSize;
    private reelCalculator: BackendReelCalculator;
    private balance: number = config.initialBalance;

    constructor() {
        this.reelCalculator = new BackendReelCalculator();
    }

    public async sendRequest(request: Request): Promise<Response> {
        let response: Response;
        if (request.action === "init") {
                response = {
                "action": "init",
                "symbols": this.reelCalculator.Reels,
                "balance": this.balance,
            }
        } else if (request.action === "spin") {      
            if (request.bet > this.balance) {
                response = {
                    "action": "error",
                    "error": "Not enough money",
                }
            } else { // TODO: tidy brackets
                const reelIndexes = this.getNewReelPositions();
                const win = this.checkForWin(reelIndexes);

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

    // TODO: change to calculate Betways win logic?

    private checkForWin(reelIndexes: number[]): number {
        const reels: SlotSymbol[][] = this.reelCalculator.getVisibleSymbols(reelIndexes);
        console.log(reels);

        // Check reels for horizontal matches
        for (let i = 0; i < reels[0].length; i++) {
            let isFull = true;

            for (let j = 0; j < reels.length; j++) {
                console.log(reels[j][i]);
                // TODO: Go over each reel, checking if three are the same in a row
                if (reels[j][i] !== reels[0][i]) {
                    isFull = false;
                    // currently checks if they are all the same
                }
            }
            if (isFull) {
                console.log("WIN");
                return 100;
            }
        } 
        return 0;        
    }

}
