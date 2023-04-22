export function formatAsEuros(amount: number): string {
    return amount.toLocaleString("en-GB", { style: "currency", currency: "EUR" });
}
