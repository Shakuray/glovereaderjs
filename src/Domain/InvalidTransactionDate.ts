export default class InvalidTransactionDate extends Error {
    constructor(text: string) {
        super("Invalid transaction date: " + text);
    }
}
