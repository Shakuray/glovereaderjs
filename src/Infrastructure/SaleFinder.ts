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
    if (type.toUpperCase().includes("FASTENER")) return ITW_FAST
    if (type.toUpperCase().includes("ESPARRAGUERA")) return ESPARRAGUERA
    if (type.toUpperCase().includes("ZARAGOZA")) return ZARAGOZA
    if (type.toUpperCase().includes("ALEMANYA")) return ALEMANYA
    if (type.toUpperCase().includes("COMPONEN")) return ITW_COMP
    if (type.toUpperCase().includes("GARRIGA")) return GARRIGA
    else throw new ListNotFound(type);
}