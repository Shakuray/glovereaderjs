import SalesFileRepository from "@/Domain/Contract/SalesFileRepository";
import File from "@/Domain/File";
import SalesReport from "@/Domain/SalesReport";
import GetSalesSubtotal from "./GetSalesSubtotal";

export default function ExportSalesReport(repository: SalesFileRepository, file: File, report: SalesReport): Promise<string> {
    return repository.save(file, report, GetSalesSubtotal(report.sales));
}
