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
//  CLASS Picture2D < Bitmap
//
// -------------------------------------------------------

/** @class
*   A class for pictures drawable in HUD.
*   @extends Bitmap
*   @property {string} path The path to the ressource.
*   @property {function} callback Function to call after the image is loaded.
*   @param {string} path The path to the ressource.
*   @param {function} callback Function to call after the image is loaded.
*   @param {number} [x=0] - Coords of the bitmap.
*   @param {number} [y=0] - Coords of the bitmap.
*   @param {number} [w=0] - Coords of the bitmap.
*   @param {number} [h=0] - Coords of the bitmap.
*/
function Picture2D(path, callback, x, y, w, h) {
    Bitmap.call(this, x, y, w, h);

    this.zoom = 1.0;
    this.opacity = 1.0;
    this.angle = 0;
    this.cover = false;
    this.stretch = false;
    if (path) {
        this.path = path;
        this.callback = callback;
        this.checked = false;
        this.empty = false;
    } else {
        this.empty = true;
    }
}

// -------------------------------------------------------

Picture2D.createImage = function(image, kind, callback, x, y, w, h) {
    return image ? new Picture2D(image.getPath(kind)[1], callback, x, y, w, h) :
        new Picture2D();
}

// -------------------------------------------------------

Picture2D.createImageWithID = function(id, kind, callback, x, y, w, h) {
    return Picture2D.createImage(RPM.datasGame.pictures.get(kind, id), kind,
        callback, x, y, w, h);
}

// -------------------------------------------------------

Picture2D.prototype = Object.create(Bitmap.prototype);

// -------------------------------------------------------

Picture2D.prototype.createCopy = function() {
    var picture = new Picture2D();

    picture.empty = this.empty;
    picture.path = this.path;
    picture.callback = this.callback;
    picture.image = this.image;
    picture.checked = true;
    picture.setW(picture.image.width);
    picture.setH(picture.image.height);

    return picture;
};

// -------------------------------------------------------

Picture2D.prototype.check = function() {
    if (this.empty) {
        Bitmap.prototype.setW.call(this, 1);
        Bitmap.prototype.setH.call(this, 1);
        this.checked = true;
        RPM.requestPaintHUD = true;
        return true;
    } else
    {
        this.image = nativeImage.createFromPath(path);
        let size = image.getSize();
        this.oW = size.width;
        this.oH = this.image.height;
        if (this.cover)
        {
            this.w = RPM.canvasWidth;
            this.h = RPM.canvasHeight;
        } else if (this.stretch)
        {
            this.w = RPM.getScreenX(size.width);
            this.h = RPM.getScreenY(size.height);
        } else
        {
            this.w = RPM.getScreenMinXY(size.width);
            this.h = RPM.getScreenMinXY(size.height);
        }

        this.callback.call(this);
        this.checked = true;
        RPM.requestPaintHUD = true;
        return true;
    }
};

// -------------------------------------------------------

Picture2D.prototype.destroy = function() {
    RPM.canvasRendering.unloadImage(this.path);
};

// -------------------------------------------------------

Picture2D.prototype.draw = function(x, y, w, h, sx, sy, sw, sh, positionResize)
{
    if (!this.checked) {
        this.check();
    }

    // Default values
    if (typeof positionResize === 'undefined') {
        positionResize = true;
    }
    if (typeof x === 'undefined') {
        x = this.x;
    } else {
        if (positionResize) {
            x = RPM.getScreenX(x);
        }
    }
    if (typeof y === 'undefined') {
        y = this.y;
    } else {
        if (positionResize) {
            y = RPM.getScreenY(y);
        }
    }
    if (typeof w === 'undefined') {
        w = this.w * this.zoom;
        if (this.centered) {
            x += (this.w - (this.w * this.zoom)) / 2;
        }
    } else {
        w = this.stretch ? RPM.getScreenX(w) : RPM.getScreenMinXY(w);
    }
    if (typeof h === 'undefined') {
        h = this.h * this.zoom;
        if (this.centered) {
            y += (this.h - (this.h * this.zoom)) / 2;
        }
    } else {
        h = this.stretch ? RPM.getScreenY(h) : RPM.getScreenMinXY(h)
    }
    if (typeof sx === 'undefined') sx = 0;
    if (typeof sy === 'undefined') sy = 0;
    if (typeof sw === 'undefined') sw = this.oW;
    if (typeof sh === 'undefined') sh = this.oH;

    if (sw <= 0 || sh <= 0) {
        return;
    }

    // Draw the image
    if (!this.empty) {
        var angle;

        angle = this.angle * Math.PI / 180;
        Platform.ctx.save();
        Platform.ctx.globalAlpha = this.opacity;
        if (!this.centered) {
            if (this.reverse) {
                Platform.ctx.scale(-1, 1);
                Platform.ctx.translate(-x -w, y);
            } else {
                Platform.ctx.translate(x, y);
            }
        }
        if (angle !== 0) {
            if (this.centered) {
                Platform.ctx.translate(x + w / 2, y + h / 2);
            }
            Platform.ctx.rotate(angle);
            if (this.centered) {
                Platform.ctx.translate(-x - w / 2, -y - h / 2);
            }
        }
        if (this.centered) {
            if (this.reverse) {
                Platform.ctx.scale(-1, 1);
                Platform.ctx.translate(-x -w, y);
            } else {
                Platform.ctx.translate(x - (w / 2), y - (h / 2));
            }
        }
        Platform.ctx.drawImage(this.path, sx, sy, sw, sh, 0, 0, w, h);
        Platform.ctx.globalAlpha = 1.0;
        Platform.ctx.restore();
    }
};
