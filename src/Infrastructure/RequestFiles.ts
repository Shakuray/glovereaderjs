import File from "@/Domain/File";
import { remote } from "electron";

export default async function RequestFiles(): Promise<File[]> {
    const files = await remote.dialog.showOpenDialog({ properties: ["openFile", "multiSelections"] });
    return files.filePaths.map((path) => new File(path));
}
