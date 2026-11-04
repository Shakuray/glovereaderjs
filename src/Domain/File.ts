export default class File {
    public name: string;
    public error: string;

    constructor(readonly fileName: string, readonly content: Blob) {
        this.name = "";
        this.error = "";
    }

    public toString(): string {
        return this.name != "" ? this.name : this.fileName;
    }

    public contents(): Promise<ArrayBuffer> {
        return this.content.arrayBuffer();
    }

    public isProcessed(): boolean {
        return this.name != "";
    }

    public process(name: string) {
        this.name = name;
    }

    public setError(msg: string) {
        this.error = msg;
    }
}
