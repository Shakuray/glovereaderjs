/** Hands a generated file to the browser, which saves it to the user's downloads */
export default function DownloadFile(fileName: string, content: BlobPart, type: string) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Revoking right away can abort the download in some browsers
    setTimeout(() => URL.revokeObjectURL(url), 60000);
}
