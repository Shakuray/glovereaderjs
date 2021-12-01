import ITW_FAST from '@/config/ITW FAST.json'
import ALEMANYA from '@/config/ALEMANYA.json'
import ESPARRAGUERA from '@/config/ESPARRAGUERA.json'
import ITW_COMP from '@/config/ITW COMP.json'
import GARRIGA from '@/config/LA GARRIGA.json'
import ZARAGOZA from '@/config/ZARAGOZA.json'
import ListNotFound from '@/Domain/ListNotFound'

export default function FindSaleName(listType : string, machineId : string, line : string) : string {
    
    const name = getList(listType).find(machine => machine.id == machineId)
        .items.find(item => item.line == line).name;

    return name;
}

function getList(type : string) : any {
    const text = type.toUpperCase();
    if (text.includes("FAST")) return ITW_FAST
    if (text.includes("ESPAR")) return ESPARRAGUERA
    if (text.includes("ZARAG")) return ZARAGOZA
    if (text.includes("ALEMA")) return ALEMANYA
    if (text.includes("COMPON")) return ITW_COMP
    if (text.includes("GARRIGA") || text.includes("LG")) return GARRIGA
    else throw new ListNotFound(type);
}