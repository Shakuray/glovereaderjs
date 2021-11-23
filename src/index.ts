import ExcelJS from 'exceljs';
import GetSalesSubtotal from './GetSalesSubtotal';
import Sale from './Sale';
import FindSale from './SaleFinder';

const workbook = new ExcelJS.Workbook(); 
workbook.xlsx.readFile("./example.xls").then(() => {
    
    const sales = [] as Sale[];

    const worksheet = workbook.getWorksheet("TManager");
    let listType : string = "";

    worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
        if (rowNumber == 2){
            listType = row.getCell(4).toString()
        }

        const excelRow = {
            machine : row.getCell(1).toString(),
            description : row.getCell(5).toString(),
            date : row.getCell(6).toString(),
            isSale : row.getCell(8).toString() == "Venta Price Holding",
            line : row.getCell(12).toString()
        }

        if (excelRow.isSale) {
            sales.push(
                new Sale(excelRow.machine, excelRow.line, excelRow.date, 
                    FindSale(listType, excelRow.machine, excelRow.line)
                )
            )
        }
    });

    const filter = workbook.addWorksheet("Filtre");
    
    filter.columns = [
        {header: 'MÁQUINA', key: 'machine', width: 15},
        {header: 'LÍNEA', key: 'line', width: 10},
        {header: 'FECHA', key: 'date', width: 20},
        {header: 'PRODUCTO', key: 'item', width: 25},
        {header: '', key: '', width: 30},
        {header: 'PRODUCTO', key: 'itemName', width: 25},
        {header: 'CANTIDAD', key: 'ammount', width: 15}
    ];
    
    const uniqueSales = GetSalesSubtotal(sales)
    sales.forEach((sale, i) => {
        const row = {
            ...sale, ...uniqueSales[i]
        }
        filter.insertRow(i + 2, row,  "n" );
    })

    workbook.views = [{
        x: 0, y: 0, width: 10000, height: 20000,
        firstSheet: 1, activeTab: 1, visibility: 'visible'
    }]

    workbook.xlsx.writeFile(`./${listType}.xlsx`)
    
})