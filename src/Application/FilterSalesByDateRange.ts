import DateRange from "@/Domain/DateRange";
import Sale from "@/Domain/Sale";

export default function FilterSalesByDateRange(sales: Sale[], range: DateRange): Sale[] {
    if (!range.isBounded()) return sales;
    return sales.filter((sale) => range.contains(sale.transactionDate()));
}
