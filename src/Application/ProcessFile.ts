import SalesFileRepository from "@/Domain/Contract/SalesFileRepository";
import File from "@/Domain/File";
import ExportSalesReport from "./ExportSalesReport";
import ReadSalesFile from "./ReadSalesFile";

export default async function ProcessFile(repository: SalesFileRepository, file: File): Promise<string> {
    const report = await ReadSalesFile(repository, file);
    await ExportSalesReport(repository, file, report);
    return report.listType;
}
