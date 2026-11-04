import File from "@/Domain/File";
import OpenFileDialog from "./OpenFileDialog";

export default async function RequestFile(): Promise<File | undefined> {
    const [file] = await OpenFileDialog({ accept: ".xlsx", multiple: false });
    return file == undefined ? undefined : new File(file.name, file);
}
