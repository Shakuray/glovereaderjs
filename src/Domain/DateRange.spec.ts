import DateRange from "./DateRange";

describe("DateRange", () => {
    const september = DateRange.between(new Date(2026, 8, 1), new Date(2026, 8, 30));

    it("includes both bound days entirely", () => {
        expect(september.contains(new Date(2026, 8, 1, 0, 0, 0))).toBe(true);
        expect(september.contains(new Date(2026, 8, 30, 23, 59, 59))).toBe(true);
    });

    it("excludes dates outside the bounds", () => {
        expect(september.contains(new Date(2026, 7, 31, 23, 59, 59))).toBe(false);
        expect(september.contains(new Date(2026, 9, 1, 0, 0, 0))).toBe(false);
    });

    it("leaves omitted bounds open", () => {
        const fromOctober = DateRange.between(new Date(2026, 9, 1));
        expect(fromOctober.contains(new Date(2030, 0, 1))).toBe(true);
        expect(fromOctober.contains(new Date(2026, 8, 30))).toBe(false);
    });

    it("accepts bounds in any order", () => {
        const reversed = DateRange.between(new Date(2026, 8, 30), new Date(2026, 8, 1));
        expect(reversed.contains(new Date(2026, 8, 15))).toBe(true);
    });

    it("is unbounded without dates", () => {
        expect(DateRange.unbounded().isBounded()).toBe(false);
        expect(DateRange.between().isBounded()).toBe(false);
        expect(september.isBounded()).toBe(true);
    });
});
