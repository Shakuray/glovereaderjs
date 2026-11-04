import File from "@/Domain/File";
import { remote } from "electron";

export default async function RequestFile(): Promise<File | undefined> {
    const result = await remote.dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{ name: "Excel", extensions: ["xlsx"] }],
    });
    return result.canceled || result.filePaths.length == 0 ? undefined : new File(result.filePaths[0]);
}
