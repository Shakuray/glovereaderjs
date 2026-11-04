import File from "@/Domain/File";
import OpenFileDialog from "./OpenFileDialog";

export default async function RequestFiles(): Promise<File[]> {
    const files = await OpenFileDialog({ accept: ".xlsx", multiple: true });
    return files.map((file) => new File(file.name, file));
}
