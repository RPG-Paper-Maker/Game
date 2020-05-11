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


const cons = require('electron').remote.getGlobal('console')

/** Initialize the game stack and datas.
*/
function initialize()
{
    $settings = new Settings();
    $gameStack = new GameStack();
}

// -------------------------------------------------------

/** Initialize the openGL stuff.
*   @param {Canvas} canvas The 3D canvas.
*/
function initializeGL(canvas)
{
    // Create the renderer
    if ($DESKTOP) {
        $renderer = new THREE.Canvas3DRenderer({
            canvas: canvas,
            devicePixelRatio: canvas.devicePixelRatio,
            antialias: true
        });
    }
    else{
        $renderer = new THREE.WebGLRenderer();
        $renderer.autoClear = false;
    }

    $renderer.setSize($canvasWidth, $canvasHeight);
}

// -------------------------------------------------------

/** Set the camera aspect while resizing the window.
*   @param {Canvas} canvas The 3D canvas.
*/
function resizeGL(canvas)
{
    $renderer.setSize($canvasWidth, $canvasHeight);
    var camera = $gameStack.camera;
    if (typeof camera !== 'undefined'){
        camera.threeCamera.aspect = $canvasWidth / $canvasHeight;
        camera.threeCamera.updateProjectionMatrix();
    }
}

// -------------------------------------------------------

/** Update the current stack.
*/
function update()
{
    // Update songs manager
    $songsManager.update();

    // Repeat keypress as long as not blocking
    var continuePressed = true;
    for (var i = 0, l = $keysPressed.length; i < l; i++){
        continuePressed = onKeyPressedRepeat($keysPressed[i]);
        if (!continuePressed)
            break;
    }

    // Update the top of the stack
    $gameStack.update();

    $elapsedTime = new Date().getTime() - $lastUpdateTime;
    $averageElapsedTime = ($averageElapsedTime + $elapsedTime) / 2;
    $lastUpdateTime = new Date().getTime();
}

// -------------------------------------------------------

/** First key press handle for the current stack.
*   @param {number} key The key ID pressed.
*/
function onKeyPressed(key)
{
    $gameStack.onKeyPressed(key);
}

// -------------------------------------------------------

/** First key release handle for the current stack.
*   @param {number} key The key ID released.
*/
function onKeyReleased(key)
{
    $gameStack.onKeyReleased(key);
}

// -------------------------------------------------------

/** Key pressed repeat handle for the current stack.
*   @param {number} key The key ID pressed.
*   @returns {boolean} false if the other keys are blocked after it.
*/
function onKeyPressedRepeat(key)
{
    return $gameStack.onKeyPressedRepeat(key);
}

// -------------------------------------------------------

/** Key pressed repeat handle for the current stack, but with
*   a small wait after the first pressure (generally used for menus).
*   @param {number} key The key ID pressed.
*   @returns {boolean} false if the other keys are blocked after it.
*/
function onKeyPressedAndRepeat(key)
{
    return $gameStack.onKeyPressedAndRepeat(key);
}

// -------------------------------------------------------

/** Draw the 3D for the current stack.
*   @param {Canvas} canvas The 3D canvas.
*/
function draw3D(canvas)
{
    $gameStack.draw3D(canvas);
}

// -------------------------------------------------------

/** Draw HUD for the current stack.
*   @param {Canvas} canvas The HUD canvas.
*/
function drawHUD(loading)
{

    if ($requestPaintHUD)
    {
        $requestPaintHUD = false;
        $context.clearRect(0, 0, $canvasWidth, $canvasHeight);
        $context.lineWidth = 1;
        $context.webkitImageSmoothingEnabled = false;
        $context.imageSmoothingEnabled = false;
        if (loading) {
            if ($loadingScene) {
                $loadingScene.drawHUD();
            }
        }
        else {
            $gameStack.drawHUD();
        }
    }
    $gameStack.displayingContent = !loading;
}

// Start!
//this.initialize();