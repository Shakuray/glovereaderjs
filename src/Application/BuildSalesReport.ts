import Sale from "@/Domain/Sale";
import SalesReport from "@/Domain/SalesReport";
import SalesSheet from "@/Domain/SalesSheet";
import FindSaleName from "./SaleFinder";

export default function BuildSalesReport({ listType, records }: SalesSheet, layout: string): SalesReport {
    const sales = records.map(
        (record) => new Sale(record.machine, record.line, record.date, record.matricula, FindSaleName(layout, record.machine, record.line))
    );

    return { listType, sales };
}
