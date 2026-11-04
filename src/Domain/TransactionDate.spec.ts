import parseTransactionDate from "./TransactionDate";
import InvalidTransactionDate from "./InvalidTransactionDate";

describe("parseTransactionDate", () => {
    it("parses dates with time", () => {
        expect(parseTransactionDate("15/09/2026 9:43:56")).toEqual(new Date(2026, 8, 15, 9, 43, 56));
    });

    it("parses dates without time", () => {
        expect(parseTransactionDate("07/10/2026")).toEqual(new Date(2026, 9, 7));
    });

    it.each(["", "2026-09-15", "31/02/2026", "not a date"])("rejects %p", (text) => {
        expect(() => parseTransactionDate(text)).toThrow(InvalidTransactionDate);
    });
});
