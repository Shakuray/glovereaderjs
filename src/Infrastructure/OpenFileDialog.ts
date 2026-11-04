/** Opens the browser file picker. Resolves with an empty list when the user cancels */
export default function OpenFileDialog(options: { accept: string; multiple: boolean }): Promise<globalThis.File[]> {
    return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = options.accept;
        input.multiple = options.multiple;
        input.addEventListener("change", () => resolve(Array.from(input.files || [])));
        input.addEventListener("cancel", () => resolve([]));
        input.click();
    });
}
