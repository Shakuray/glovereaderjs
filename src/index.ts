import ExcelJS from 'exceljs';

const workbook = new ExcelJS.Workbook(); 
workbook.xlsx.readFile("./example.xls").then(() => {
    const worksheet = workbook.getWorksheet("TManager");
    worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
        console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
    });
})
