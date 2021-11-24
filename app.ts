import { app, BrowserWindow, dialog } from 'electron';
import Main from './Main';
import ProcessFile from './src/ProcessFile';


Main.main(app, BrowserWindow);

app.whenReady().then(() => {
    dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }).then(async (i) => {
        i.filePaths.forEach(async (file) => {
            try{
                await ProcessFile(file);
            }catch(e) {
                dialog.showMessageBox(e);
                console.error(e);
            }
        })
    })
})
