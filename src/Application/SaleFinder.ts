import ListNotFound from "@/Domain/ListNotFound";
import ProductNotFound from "@/Domain/ProductNotFound";
import StaticConfigRepository from "../Infrastructure/StaticConfigRepository";

export function LayoutNames(): string[] {
    return new StaticConfigRepository().get().map((layout) => layout.name);
}

/** Picks the layout from the sheet's list type. Undefined when no rule matches */
export function DetectLayout(listType: string): string | undefined {
    const text = listType.toUpperCase();
    if (text.includes("FAST") || text.includes("2K")) return "ITW FAST";
    if (text.includes("ESPA")) return "ESPARRAGUERA";
    if (text.includes("ZARA")) return "ZARAGOZA";
    if (text.includes("ALEM") || text.includes("1K")) return "ALEMANYA";
    if (text.includes("COMP")) return "ITW COMP";
    if (text.includes("GAR") || text.includes("LG")) return "LA GARRIGA";
    return undefined;
}

export default function FindSaleName(layout: string, machineId: string, line: string): string {
    const machines = getLayout(layout);

    let machine = machines[0];
    if (machines.length > 1) {
        machine = machines.find((machine) => machine.id == machineId)!;
    }

    const item = machine?.items.find((item) => item.line == line);
    if (item == undefined) throw new ProductNotFound(layout, machineId, line);
    return item.name;
}

function getLayout(name: string) {
    const layout = new StaticConfigRepository().get().find((layout) => layout.name == name);
    if (layout == undefined) throw new ListNotFound(name);
    return layout.data;
}
