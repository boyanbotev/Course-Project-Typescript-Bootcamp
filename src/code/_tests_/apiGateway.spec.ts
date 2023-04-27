import { APIGateway } from '../common/apiGateway';
import { FakeAPI } from '../backend/fakeAPI';
import { InitResponse } from '../common/types';

describe("apiGateway", () => {
    it ("should return a valid response to an initRequest", () => {
        const fakeAPI = new FakeAPI();
        const apiGateway = new APIGateway(fakeAPI);

        const response = apiGateway.requestInitalSymbols();
        expect(response).toBeDefined();

        response.then((value) => {
            expect(value).toBeDefined();
            expect(value.action).toBe("init");
            
            const initResponse = value as InitResponse;

            expect(initResponse.symbols.length).toBeGreaterThan(0);
            expect(initResponse.symbols[0].length).toBeGreaterThan(0);

            expect(initResponse.balance).toBeDefined();

            const symbols = initResponse.symbols;
            const symbol = symbols[0][0];

            expect(symbol).toBeGreaterThanOrEqual(1);
        });
    });

    it ("should return a valid response to a spin request", () => {
        const fakeAPI = new FakeAPI();
        const apiGateway = new APIGateway(fakeAPI);

        const response = apiGateway.requestSpin(1);
        expect(response).toBeDefined();

        response.then((value) => {
            expect(value).toBeDefined();
            expect(value.action).toBe("update");

            const updateResponse = value;

            expect(updateResponse["spin-result"]).toBeDefined();

            const spinResult = updateResponse["spin-result"];
            expect(spinResult.symbols.length).toBeGreaterThan(0);
            expect(spinResult.symbols[0].length).toBeGreaterThan(0);

            expect(updateResponse.balance).toBeDefined();
        });
    });
});