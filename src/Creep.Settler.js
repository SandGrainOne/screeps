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
            if (this.Room.controller && this.creep.pos.isNearTo(this.Room.controller)) {
                if (!this.Room.controller.sign || this.Room.controller.sign.username !== C.USERNAME) {
                    this.creep.signController(this.Room.controller, "For the Sand empire!");
                }
                if (this.Room.name === "E73N87") {
                    this.creep.claimController(this.Room.controller);
                }
                else {
                    this.creep.reserveController(this.Room.controller);
                }
            }
        }

        if (!this.atWork) {
            this.moveToRoom(this.WorkRoom.name);
        }
        else {
            if (this.Room.controller && !this.creep.pos.isNearTo(this.Room.controller)) {
                this.moveTo(this.Room.controller);
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
