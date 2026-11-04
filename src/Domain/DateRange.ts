/**
 * Inclusive range of whole days. Any bound can be omitted to leave that side open.
 */
export default class DateRange {
    private constructor(readonly from?: Date, readonly to?: Date) {}

    static unbounded(): DateRange {
        return new DateRange();
    }

    static between(from?: Date, to?: Date): DateRange {
        if (from && to && from > to) [from, to] = [to, from];
        return new DateRange(from && startOfDay(from), to && endOfDay(to));
    }

    isBounded(): boolean {
        return this.from != undefined || this.to != undefined;
    }

    contains(date: Date): boolean {
        if (this.from && date < this.from) return false;
        if (this.to && date > this.to) return false;
        return true;
    }
}

function startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}
