import Config from "@/Domain/Config";
import ConfigRepository from "@/Domain/Contract/ConfigRepository";
var fs = require("fs");

export default class ConfigFileRepository implements ConfigRepository {
    get(): { data: Config[]; name: string }[] {
        return [
            { data: JSON.parse(fs.readFileSync("src/config/ITW FAST.json", "utf8")), name: "ITW FAST" },
            { data: JSON.parse(fs.readFileSync("src/config/ALEMANYA.json", "utf8")), name: "ALEMANYA" },
            { data: JSON.parse(fs.readFileSync("src/config/ESPARRAGUERA.json", "utf8")), name: "ESPARRAGUERA" },
            { data: JSON.parse(fs.readFileSync("src/config/ITW COMP.json", "utf8")), name: "ITW COMP" },
            { data: JSON.parse(fs.readFileSync("src/config/LA GARRIGA.json", "utf8")), name: "LA GARRIGA" },
            { data: JSON.parse(fs.readFileSync("src/config/ZARAGOZA.json", "utf8")), name: "ZARAGOZA" },
        ];
    }

    save(item: { data: Config[]; name: string }) {
        fs.writeFileSync("src/config/" + item.name + ".json", JSON.stringify(item.data));
    }
}
