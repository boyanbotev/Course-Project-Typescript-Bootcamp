import { Request, Response } from "./types";

export class FakeAPI {
    private constructor() { }

    private static responses: Response[] = [
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

    public static async sendRequest(request: Request): Promise<Response> {
        return new Promise((resolve, reject) => {
            const response = this.responses.shift();
            if (response) {
                resolve(response);
            } else {
                reject("No responses left");
            }
        });
    }
}
