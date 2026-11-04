import InvalidTransactionDate from "./InvalidTransactionDate";

const TRANSACTION_DATE_FORMAT = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/;

/**
 * Parses vending machine dates with format "dd/mm/yyyy[ H:mm[:ss]]".
 */
export default function parseTransactionDate(text: string): Date {
    const match = TRANSACTION_DATE_FORMAT.exec(text.trim());
    if (match == null) throw new InvalidTransactionDate(text);

    const [, day, month, year, hours = "0", minutes = "0", seconds = "0"] = match;
    const date = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);

    if (date.getDate() != +day || date.getMonth() != +month - 1) throw new InvalidTransactionDate(text);
    return date;
}
