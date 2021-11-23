import FASTENERS from '../config/ITW FAST.json'

export default function FindSaleName(machineId : string, line : string) : string {
    const name = FASTENERS.find(machine => machine.id == machineId)
        .items.find(item => item.line == line).name;

    return name;
}