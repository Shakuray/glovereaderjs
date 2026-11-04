export interface SaleRecord {
    machine: string;
    line: string;
    date: string;
    matricula: string;
}

export default interface SalesSheet {
    listType: string;
    records: SaleRecord[];
}
