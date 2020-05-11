/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

const ipc = require('electron').ipcRenderer;

window.onerror = function (msg, url, line, column, error)
{
    // Convert error to Object to it can be properly send to main process
    let obj = {};
    Object.getOwnPropertyNames(error).forEach(function(key) 
    {
        obj[key] = error[key];
    });

    // Send it to main process to open a dialog box
    ipc.send('window-error', obj);
}

function Platform()
{

}

Platform.DESKTOP = true;

Platform.quit = function()
{
    window.close();
}