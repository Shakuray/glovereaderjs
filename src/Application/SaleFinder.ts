import ListNotFound from "@/Domain/ListNotFound";
import Config from "@/Domain/Config";
import ConfigFileRepository from "../Infrastructure/ConfigFileRepository";

export default function FindSaleName(listType: string, machineId: string, line: string): string {
    const machines = getList(listType);

    let machine = machines[0];
    if (machines.length > 1) {
        machine = machines.find((machine) => machine.id == machineId)!;
    }

    return machine.items.find((item) => item.line == line)!.name;
}

function getList(type: string): Config[] {
    const repo = new ConfigFileRepository();
    const files = repo.get();
    const text = type.toUpperCase();
    console.log(text);
    if (text.includes("FAST") || text.includes("2K"))
        return files.find((file) => file.name == "ITW FAST")!.data;
    if (text.includes("ESPAR")) return files.find((file) => file.name == "ESPARRAGUERA")!.data;
    if (text.includes("ZARAG")) return files.find((file) => file.name == "ZARAGOZA")!.data;
    if (text.includes("ALEMA")) return files.find((file) => file.name == "ALEMANYA")!.data;
    if (text.includes("COMPON")) return files.find((file) => file.name == "ITW COMP")!.data;
    if (text.includes("GARRIGA") || text.includes("LG"))
        return files.find((file) => file.name == "LA GARRIGA")!.data;
    else throw new ListNotFound(type);
}
