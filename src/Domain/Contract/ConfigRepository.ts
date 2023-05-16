import Config from "../Config";

export default interface ConfigRepository {
    get(): { data: Config[]; name: string }[];
    save(item: { data: Config[]; name: string });
}
