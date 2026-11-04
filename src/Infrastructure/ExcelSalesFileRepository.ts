import ExcelJS from "exceljs/dist/es5/exceljs.browser";
import SalesFileRepository from "@/Domain/Contract/SalesFileRepository";
import File from "@/Domain/File";
import SalesReport from "@/Domain/SalesReport";
import SalesSheet, { SaleRecord } from "@/Domain/SalesSheet";
import Subtotal from "@/Domain/Subtotal";

const SOURCE_SHEET = "TManager";
const FILTER_SHEET = "Filtre";
const SALE_TRANSACTION = "Venta Price Holding";

export default class ExcelSalesFileRepository implements SalesFileRepository {
    async read(file: File): Promise<SalesSheet> {
        const workbook = await this.load(file);
        const worksheet = workbook.getWorksheet(SOURCE_SHEET);

        const records = [] as SaleRecord[];
        let listType = "";
        let lastMatricula = "";

        worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
            if (rowNumber == 2) {
                listType = row.getCell(4).toString();
            }

            const excelRow = {
                machine: row.getCell(1).toString(),
                date: row.getCell(6).toString(),
                isSale: row.getCell(8).toString() == SALE_TRANSACTION,
                matricula: row.getCell(9).toString(),
                line: row.getCell(12).toString(),
            };

            if (excelRow.matricula) {
                lastMatricula = excelRow.matricula;
            } else {
                excelRow.matricula = lastMatricula;
            }

            if (excelRow.isSale) {
                records.push({
                    machine: excelRow.machine,
                    line: excelRow.line,
                    date: excelRow.date,
                    matricula: excelRow.matricula,
                });
            }
        });

        return { listType, records };
    }

    async save(file: File, report: SalesReport, subtotals: Subtotal[]): Promise<string> {
        const workbook = await this.load(file);

        const previousFilter = workbook.getWorksheet(FILTER_SHEET);
        if (previousFilter != undefined) {
            workbook.removeWorksheet(previousFilter.id);
        }
        const filter = workbook.addWorksheet(FILTER_SHEET);

        filter.columns = [
            { header: "MÁQUINA", key: "machine", width: 15 },
            { header: "LÍNEA", key: "line", width: 10 },
            { header: "FECHA", key: "date", width: 20 },
            { header: "MATRICULA", key: "matricula", width: 20 },
            { header: "PRODUCTO", key: "item", width: 25 },
            { header: "", key: "", width: 30 },
            { header: "PRODUCTO", key: "itemName", width: 25 },
            { header: "CANTIDAD", key: "ammount", width: 15 },
        ];

        report.sales.forEach((sale, i) => {
            const row = {
                ...sale,
                ...subtotals[i],
            };
            filter.insertRow(i + 2, row, "n");
        });

        workbook.views = [
            {
                x: 0,
                y: 0,
                width: 10000,
                height: 20000,
                firstSheet: 1,
                activeTab: 1,
                visibility: "visible",
            },
        ];

        const pathToSave = `${this.directoryOf(file)}/${report.listType}.xlsx`;
        await workbook.xlsx.writeFile(pathToSave);
        return pathToSave;
    }

    private async load(file: File) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(file.toString());
        return workbook;
    }

    private directoryOf(file: File): string {
        const fullPath = file.toString();
        const lastSep = Math.max(fullPath.lastIndexOf("/"), fullPath.lastIndexOf("\\"));
        return fullPath.substring(0, lastSep);
    }
}
