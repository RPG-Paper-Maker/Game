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
//  CLASS Camera
//
// -------------------------------------------------------

/** @class
*   The camera of the current map.
*   @property {THREE.PerspectiveCamera} threeCamera The three.js camera.
*   @property {number} distance The x/z axis distance between the camera and
*   the target.
*   @property {number} height The y distance between the camera and the target.
*   @property {number} horizontalAngle The horizontal angle of the camera.
*   @property {THREE.Vector3} target The position of the target.
*   @param {number} d The camera distance.
*   @param {number} h The camera height.
*/
function Camera(cameraProperties, target) {
    cameraProperties.initializeCamera(this);
    this.target = target;
}

Camera.prototype = {

    getDistance: function() {
        return this.distance * Math.sin(this.verticalAngle * Math.PI / 180.0);
    },

    getHeight: function() {
        return this.distance * Math.cos(this.verticalAngle * Math.PI / 180.0);
    },

    getHorizontalAngle: function(p1, p2) {
        return Math.atan2(p2.z - p1.z, p2.x - p1.x) * 180 / Math.PI;
    },

    getVerticalAngle: function(p2, p1) {
        var x = p1.x - p2.x;
        var y = p1.y - p2.y;
        var z = p1.z - p2.z;

        return 90 + (Math.atan2(y, Math.sqrt(x*x + z*z)) * 180 / Math.PI);
    },

    addVerticalAngle: function(a) {
        if (this.verticalRight) {
            this.verticalAngle += a;
            if (this.verticalAngle >= 180 || this.verticalAngle <= 0)
                this.verticalRight = false;
        }
        else {
            this.verticalAngle -= a;
            if (this.verticalAngle >= 180 || this.verticalAngle <= 0)
                this.verticalRight = true;
        }
    },

    updateTargetPosition: function() {
        this.targetPosition =
             this.target.position.clone().add(this.targetOffset);
    },

    updateCameraPosition: function() {
        var distance = this.getDistance();
        var height = this.getHeight();

        this.threeCamera.position.x = this.targetPosition.x -
             (distance * Math.cos(this.horizontalAngle * Math.PI / 180.0));
        this.threeCamera.position.y = this.targetPosition.y + height;
        this.threeCamera.position.z = this.targetPosition.z -
             (distance * Math.sin(this.horizontalAngle * Math.PI / 180.0));
    },

    updateTargetOffset: function() {
        var distance = this.getDistance();
        var height = this.getHeight();

        var x = this.threeCamera.position.x -
                (distance * Math.cos((this.horizontalAngle + 180) *
                                     Math.PI / 180.0));
        var y = this.threeCamera.position.y - height;
        var z = this.threeCamera.position.z -
                (distance * Math.sin((this.horizontalAngle + 180) *
                                     Math.PI / 180.0));

        this.targetOffset.x += x - this.targetPosition.x;
        this.targetOffset.y += y - this.targetPosition.y;
        this.targetOffset.z += z - this.targetPosition.z;
    },

    updateAngles: function() {
        this.horizontalAngle =
             this.getHorizontalAngle(this.threeCamera.position,
                                     this.targetPosition);
        this.verticalAngle =
             this.getVerticalAngle(this.threeCamera.position,
                                   this.targetPosition);
    },

    updateDistance: function() {
        this.distance =
             this.threeCamera.position.distanceTo(this.targetPosition);
    },

    /** Update the camera position and target.
    */
    update: function() {

        // Update target
        this.updateTargetPosition();

        // Update position
        this.updateCameraPosition();

        // Update view
        this.updateView();
    },

    updateView: function() {
        this.threeCamera.lookAt(this.targetPosition);
        $currentMap.orientation = this.getMapOrientation();
    },

    /** Update the camera angle.
    */
    getMapOrientation: function() {
        return RPM.mod(Math.round((this.horizontalAngle) / 90) - 1, 4);
    }
}
