export default class File {
    public name : string;
    public error : string;

    constructor(
        private file : string
    ) {
        this.name = "";
        this.error = "";
    }

    public toString() : string {
        return (this.name != "" ? this.name : this.file);
    }

    public isProcessed() : boolean {
        return this.name != "";
    }

    public process(name : string) {
        this.name = name;
    }

    public setError(msg : string) {
        this.error = msg;
    }
}