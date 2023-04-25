import { formatAsEuros } from "../common/formatAsEuros";

describe("formatAsEuros", () => {
    it("should format a number as euros", () => {
        expect(formatAsEuros(1234.567)).toBe("€1,234.57");
    });
    }
);
