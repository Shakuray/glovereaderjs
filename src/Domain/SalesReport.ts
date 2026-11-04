import Sale from "./Sale";

export default interface SalesReport {
    listType: string;
    sales: Sale[];
}
