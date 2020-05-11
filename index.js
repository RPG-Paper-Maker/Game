/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

const { app, BrowserWindow, dialog } = require('electron')

var ipc = require('electron').ipcMain;

function createWindow () {
    let window;
    
    window = new BrowserWindow({
        width: 640,
        height: 480,
        webPreferences: {
            nodeIntegration: true
        }
    });
    ipc.on('window-error', function(event, err) {
        let str = "";
        if (err != null) 
        {
            if (err.stack != null) 
            {
                str += err.stack;
            } else if (err.message != null) 
            {
                str += err.message;
            }
        }
        dialog.showMessageBoxSync({ title: 'Error', type: 'error', message: str });
        window.close()
    })
    window.loadFile('index.html');
    window.removeMenu();
}

app.whenReady().then(createWindow)

// Mac OS keep active 
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

// Mac OS open new window if clicking on dock again
app.on('activate', () => {
    if (window === null) {
        createWindow();
    }
})