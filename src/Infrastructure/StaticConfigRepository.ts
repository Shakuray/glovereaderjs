import Config from "@/Domain/Config";
import ConfigRepository from "@/Domain/Contract/ConfigRepository";
import itwFast from "@/config/ITW FAST.json";
import alemanya from "@/config/ALEMANYA.json";
import esparraguera from "@/config/ESPARRAGUERA.json";
import itwComp from "@/config/ITW COMP.json";
import laGarriga from "@/config/LA GARRIGA.json";
import zaragoza from "@/config/ZARAGOZA.json";

/** Config is bundled at build time: edit the json files in src/config and rebuild */
export default class StaticConfigRepository implements ConfigRepository {
    get(): { data: Config[]; name: string }[] {
        return [
            { data: itwFast, name: "ITW FAST" },
            { data: alemanya, name: "ALEMANYA" },
            { data: esparraguera, name: "ESPARRAGUERA" },
            { data: itwComp, name: "ITW COMP" },
            { data: laGarriga, name: "LA GARRIGA" },
            { data: zaragoza, name: "ZARAGOZA" },
        ];
    }
}
