'use strict';

let C = require('constants');

let CreepWorker = require('Creep.Worker');

/**
 * Wrapper class for creeps with logic for a settler.
 * Primary purpose of these creeps are to claim or reserve a controller in other rooms.
 */
class CreepSettler extends CreepWorker {
    /**
     * Initializes a new instance of the CreepSettler class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep) {
        super(creep);
    }
    
    /**
     * Perform settler related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        if (this.atWork) {
            if (this.room.controller && this.pos.isNearTo(this.room.controller)) {
                if (!this.room.controller.sign || this.room.controller.sign.username !== C.USERNAME) {
                    this._creep.signController(this.room.controller, "For the Sand empire!");
                }
                if (this.room.name === "EEE") {
                    this._creep.claimController(this.room.controller);
                }
                else {
                    this._creep.reserveController(this.room.controller);
                }
            }
        }

        if (!this.atWork) {
            this.moveToRoom(this.WorkRoom.name);
        }
        else {
            if (this.room.controller && !this.pos.isNearTo(this.room.controller)) {
                this.moveTo(this.room.controller);
            }
        }

        return true;
    }

    /**
     * Perform settler specific retreat logic. Because the lifespan of a settler is so short it might
     * be best if it stays at the controller and work instead of retreating.
     * 
     * @returns {Boolean} true if the retreat was required and the creep is on the move
     */
    retreat() {
        return false;
    }
}

module.exports = CreepSettler;
