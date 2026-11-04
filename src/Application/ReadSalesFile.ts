import SalesFileRepository from "@/Domain/Contract/SalesFileRepository";
import File from "@/Domain/File";
import ListNotFound from "@/Domain/ListNotFound";
import SalesReport from "@/Domain/SalesReport";
import BuildSalesReport from "./BuildSalesReport";
import { DetectLayout } from "./SaleFinder";

export default async function ReadSalesFile(repository: SalesFileRepository, file: File): Promise<SalesReport> {
    const sheet = await repository.read(file);
    const layout = DetectLayout(sheet.listType);
    if (layout == undefined) throw new ListNotFound(sheet.listType);

    return BuildSalesReport(sheet, layout);
}
