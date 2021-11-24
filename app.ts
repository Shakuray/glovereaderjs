import { app, BrowserWindow, dialog } from 'electron';
import Main from './Main';
import ProcessFile from './src/ProcessFile';


Main.main(app, BrowserWindow);

app.whenReady().then(() => {
    dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }).then((i) => {
        i.filePaths.forEach(file => {
            console.log("Start processing "+file);
            ProcessFile(file);
        })
    })
})
