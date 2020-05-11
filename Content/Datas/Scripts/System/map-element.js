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
//  CLASS MapElement
//
// -------------------------------------------------------

/** @class
*   An element in the map.
*   @property {Orientation} orientation The orientation according to layer.
*   @property {CameraUpDown} upDown The camera up down orientation according to
*   layer.
*   @property {number} xOffset The offset of the object according to layer.
*   @property {number} yOffset The offset of the object according to layer.
*   @property {number} zOffset The offset of the object according to layer.
*/
function MapElement() {
    this.xOffset = 0;
    this.yOffset = 0;
    this.zOffset = 0;
}

MapElement.prototype = {

    /** Read the JSON associated to the map element.
    *   @param {Object} json Json object describing the object.
    */
    read: function(json) {
        var x = json.xOff;
        var y = json.yOff;
        var z = json.zOff;

        if (typeof(x) !== 'undefined')
            this.xOffset = x;
        if (typeof(y) !== 'undefined')
            this.yOffset = y;
        if (typeof(z) !== 'undefined')
            this.zOffset = z;
    },

    /** Scale the vertices correctly.
    *   @param {THREE.Vector3} vecA The A vertex to rotate.
    *   @param {THREE.Vector3} vecB The B vertex to rotate.
    *   @param {THREE.Vector3} vecC The C vertex to rotate.
    *   @param {THREE.Vector3} vecD The D vertex to rotate.
    *   @param {THREE.Vector3} center The center to rotate around.
    */
    scale: function(vecA, vecB, vecC, vecD, center, position, size, kind) {
        var zPlus = RPM.positionLayer(position) * 0.05;

        // Apply an offset according to layer position
        if (kind !== ElementMapKind.SpritesFace && !this.front)
            zPlus *= -1;

        var offset = new THREE.Vector3(0, 0, zPlus);

        // Center
        center.setX(this.xOffset * $SQUARE_SIZE);
        center.setY(this.yOffset * $SQUARE_SIZE);
        center.setZ(this.zOffset * $SQUARE_SIZE);

        // Position
        var pos = center.clone();
        pos.add(offset);
        center.setY(center.y + (size.y / 2));
        vecA.multiply(size);
        vecB.multiply(size);
        vecC.multiply(size);
        vecD.multiply(size);
        vecA.add(pos);
        vecB.add(pos);
        vecC.add(pos);
        vecD.add(pos);
    }
}
