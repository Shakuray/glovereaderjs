import File from "../File";
import SalesReport from "../SalesReport";
import SalesSheet from "../SalesSheet";
import Subtotal from "../Subtotal";

export default interface SalesFileRepository {
    read(file: File): Promise<SalesSheet>;
    /** Returns the name of the saved file */
    save(file: File, report: SalesReport, subtotals: Subtotal[]): Promise<string>;
}
