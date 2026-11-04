export default class ProductNotFound extends Error {
    constructor(layout: string, machine: string, line: string) {
        super(`Layout ${layout} has no product for machine ${machine}, line ${line}`);
    }
}
