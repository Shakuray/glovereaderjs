import parseTransactionDate from "./TransactionDate";

export default class Sale {
    constructor(readonly machine: string, readonly line: string, readonly date: string, readonly matricula: string, readonly item: string) {}

    transactionDate(): Date {
        return parseTransactionDate(this.date);
    }
}
