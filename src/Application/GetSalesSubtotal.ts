import Sale from "../Domain/Sale";
import Subtotal from "../Domain/Subtotal";

export default function GetSalesSubtotal(sales: Sale[]) {
    const subtotals = [] as Subtotal[];

    sales.forEach((sale) => {
        const subtotal = subtotals.find((subtotal) => subtotal.itemName == sale.item);

        if (subtotal != undefined) {
            subtotal.ammount += 1;
        } else {
            subtotals.push({
                itemName: sale.item,
                ammount: 1,
            });
        }
    });

    return subtotals;
}
