export default class ListNotFound extends Error {
    constructor(text: string) {
        super("List not found for " + text);
    }
}
