/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

// -------------------------------------------------------
//
//  [MAIN]
//
//  Main file that always needs to be on the bottom of the other scripts.
//  Contains all the global functions and variables.
//
// -------------------------------------------------------

/** Initialize the game stack and datas.
*/
RPM.initialize = function()
{
    RPM.songsManager = new SongsManager();
    RPM.settings = new Settings();
    RPM.gameStack = new GameStack();
}

// -------------------------------------------------------

/** Initialize the openGL stuff.
*/
RPM.initializeGL = function()
{
    // Create the renderer
    RPM.renderer = new THREE.WebGLRenderer();
    RPM.renderer.autoClear = false;
    RPM.renderer.setSize(RPM.canvasWidth, RPM.canvasHeight);
}

// -------------------------------------------------------

/** Set the camera aspect while resizing the window.
*   @param {Canvas} canvas The 3D canvas.
*/
RPM.resizeGL = function(canvas)
{
    RPM.renderer.setSize(RPM.canvasWidth, RPM.canvasHeight);
    var camera = RPM.gameStack.camera;
    if (typeof camera !== 'undefined'){
        camera.threeCamera.aspect = RPM.canvasWidth / RPM.canvasHeight;
        camera.threeCamera.updateProjectionMatrix();
    }
}

// -------------------------------------------------------

/** Update the current stack.
*/
RPM.update = function()
{
    // Update songs manager
    RPM.songsManager.update();

    // Repeat keypress as long as not blocking
    var continuePressed = true;
    for (var i = 0, l = RPM.keysPressed.length; i < l; i++){
        continuePressed = onKeyPressedRepeat(RPM.keysPressed[i]);
        if (!continuePressed)
            break;
    }

    // Update the top of the stack
    RPM.gameStack.update();

    RPM.elapsedTime = new Date().getTime() - RPM.lastUpdateTime;
    RPM.averageElapsedTime = (RPM.averageElapsedTime + RPM.elapsedTime) / 2;
    RPM.lastUpdateTime = new Date().getTime();
}

// -------------------------------------------------------

/** First key press handle for the current stack.
*   @param {number} key The key ID pressed.
*/
RPM.onKeyPressed = function(key)
{
    RPM.gameStack.onKeyPressed(key);
}

// -------------------------------------------------------

/** First key release handle for the current stack.
*   @param {number} key The key ID released.
*/
RPM.onKeyReleased = function(key)
{
    RPM.gameStack.onKeyReleased(key);
}

// -------------------------------------------------------

/** Key pressed repeat handle for the current stack.
*   @param {number} key The key ID pressed.
*   @returns {boolean} false if the other keys are blocked after it.
*/
RPM.onKeyPressedRepeat = function(key)
{
    return RPM.gameStack.onKeyPressedRepeat(key);
}

// -------------------------------------------------------

/** Key pressed repeat handle for the current stack, but with
*   a small wait after the first pressure (generally used for menus).
*   @param {number} key The key ID pressed.
*   @returns {boolean} false if the other keys are blocked after it.
*/
RPM.onKeyPressedAndRepeat = function(key)
{
    return RPM.gameStack.onKeyPressedAndRepeat(key);
}

// -------------------------------------------------------

/** Draw the 3D for the current stack.
*   @param {Canvas} canvas The 3D canvas.
*/
RPM.draw3D = function(canvas)
{
    RPM.gameStack.draw3D(canvas);
}

// -------------------------------------------------------

/** Draw HUD for the current stack.
*   @param {Canvas} canvas The HUD canvas.
*/
RPM.drawHUD = function(loading)
{

    if (RPM.requestPaintHUD)
    {
        RPM.requestPaintHUD = false;
        RPM.context.clearRect(0, 0, RPM.canvasWidth, RPM.canvasHeight);
        RPM.context.lineWidth = 1;
        RPM.context.webkitImageSmoothingEnabled = false;
        RPM.context.imageSmoothingEnabled = false;
        if (loading) {
            if (RPM.loadingScene) {
                RPM.loadingScene.drawHUD();
            }
        }
        else {
            RPM.gameStack.drawHUD();
        }
    }
    RPM.gameStack.displayingContent = !loading;
}

// Start!
RPM.initializeGL();
RPM.initialize();

//requestAnimationFrame( RPM.update );