export default class Sale {
    constructor(
        readonly machine : string,
        readonly line : string,
        readonly date : string,
        readonly item : string
    ) { }
}