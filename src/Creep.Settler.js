'use strict';

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
        if (this.AtWork) {
            if (this.Room.Controller && this.creep.pos.isNearTo(this.Room.Controller)) {
                if (this.Name === " ") {
                    this.creep.signController(this.Room.Controller, "For the Sand empire!");
                    this.creep.claimController(this.Room.Controller);
                }
                else {
                    this.creep.reserveController(this.Room.Controller);
                }
            }
        }

        if (!this.AtWork) {
            this.moveToRoom(this.WorkRoom.Name);
        }
        else {
            if (this.Room.Controller && !this.creep.pos.isNearTo(this.Room.Controller)) {
                this.moveTo(this.Room.Controller);
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
