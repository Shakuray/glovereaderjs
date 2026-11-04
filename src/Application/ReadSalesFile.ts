import SalesFileRepository from "@/Domain/Contract/SalesFileRepository";
import File from "@/Domain/File";
import Sale from "@/Domain/Sale";
import SalesReport from "@/Domain/SalesReport";
import FindSaleName from "./SaleFinder";

export default async function ReadSalesFile(repository: SalesFileRepository, file: File): Promise<SalesReport> {
    const { listType, records } = await repository.read(file);

    const sales = records.map(
        (record) => new Sale(record.machine, record.line, record.date, record.matricula, FindSaleName(listType, record.machine, record.line))
    );

    return { listType, sales };
}
