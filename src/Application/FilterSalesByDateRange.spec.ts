import FilterSalesByDateRange from "./FilterSalesByDateRange";
import DateRange from "@/Domain/DateRange";
import Sale from "@/Domain/Sale";

const sale = (date: string) => new Sale("00001315", "1", date, "65037389", "GUANTE");

describe("FilterSalesByDateRange", () => {
    const sales = [sale("07/09/2026 15:57:32"), sale("30/09/2026 23:10:00"), sale("01/10/2026 8:00:00"), sale("14/10/2026 10:39:24")];

    it("keeps only sales inside the range", () => {
        const september = DateRange.between(new Date(2026, 8, 1), new Date(2026, 8, 30));
        expect(FilterSalesByDateRange(sales, september).map((s) => s.date)).toEqual(["07/09/2026 15:57:32", "30/09/2026 23:10:00"]);
    });

    it("keeps every sale when the range is unbounded", () => {
        expect(FilterSalesByDateRange(sales, DateRange.unbounded())).toEqual(sales);
    });

    it("does not parse dates when the range is unbounded", () => {
        expect(FilterSalesByDateRange([sale("garbage")], DateRange.unbounded())).toHaveLength(1);
    });
});
