import { ReelManager, Reel } from "./ReelManager";
import { Request, Response } from "./types";

export class FakeAPI {
    private reelNumber: number = 4; // get from config
    private reelSize: number = 20; // get from config
    private reelManager: ReelManager;
    private initalBalance: number = 100;

    constructor() {
        this.reelManager = new ReelManager();
    }

    private responses: Response[] = [
        {
            "action": "update",
            "spin-result": {
                "reelIndexes": [1, 6, 3, 2],
                "win": 0,
            },
            "balance": 95,
        },
        {
            "action": "update",
            "spin-result": {
                "reelIndexes": [1, 6, 3, 2],
                "win": 100,
            },
            "balance": 195,
        },
        {
            "action": "update",
            "spin-result": {
                "reelIndexes": [1, 6, 3, 2],
                "win": 0,
            },
            "balance": 190,
        },
    ]

    public async sendRequest(request: Request): Promise<Response> {
        let response: Response;
        if (request.action === "init") {
                response = {
                "action": "init",
                "symbols": this.reelManager.Reels,
                "balance": this.initalBalance,
            }
        } else if (request.action === "spin") {
            const reelIndexes = this.getNewReelPositions();
            const win = this.checkForWin(reelIndexes);

            const newBalance = this.initalBalance - request.bet + win;

            response = {
                "action": "update",
                "spin-result": {
                    "reelIndexes": reelIndexes,
                    "win": win,
                },
                "balance": newBalance,
            }
        }
        return new Promise((resolve, reject) => {
           // const response = this.responses.shift();
            if (response) {
                resolve(response);
            } else {
                reject("No response");
            }
        });
    }

    private getNewReelPositions(): number[] {
        const positions: number[] = [];
        for (let i = 0; i < this.reelNumber; i++) {
            positions.push(Math.floor(Math.random() * this.reelSize));
        }
        return positions;
    }

    private checkForWin(reelIndexes: number[]): number {
        const reels: Reel[] = this.reelManager.getVisibleSymbols(reelIndexes);
        console.log(reels);

        // Check reels for horizontal matches
        for (let i = 0; i < reels[0].symbols.length; i++) {
            let isFull = true;
            console.log("#################");
            for (let j = 0; j < reels.length; j++) {
                console.log(reels[j].symbols[i]);
                // TODO: Go over each reel, checking if three are the same in a row
                if (reels[j].symbols[i] !== reels[0].symbols[i]) {
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
