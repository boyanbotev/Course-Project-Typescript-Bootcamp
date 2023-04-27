import { FakeAPI } from "../backend/fakeAPI";
import { UpdateResponse, InitResponse, Request } from "../common/types";

export class APIGateway {
    private readonly api: FakeAPI;

    constructor(api: FakeAPI) {
        this.api = api;
    }

    public async requestSpin(bet: number): Promise<UpdateResponse> {  
        const request: Request = {
            action: "spin",
            "bet": bet,
        }
        const response = await this.api.sendRequest(request);
        console.log(response);
    
        if (response.action === "error") {
            throw new Error(response.error);
        }
    
        const updateResponse = response as UpdateResponse;
        return updateResponse;
    }
    
    public async requestInitalSymbols() {
        const request: Request = {
            action: "init",
        };
    
        const response = await this.api.sendRequest(request) as InitResponse;
        console.log(response);
    
        return response;
    }
}
