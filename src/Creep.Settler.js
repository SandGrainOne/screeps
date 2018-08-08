'use strict';

let CreepBase = require('Creep.Base');

/**
 * Wrapper class for creeps with logic for a settler.
 * Primary purpose of these creeps are to claim or reserve a controller in other rooms.
 */
class CreepSettler extends CreepBase {   
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
        if (this.moveOut()) {
            if (this.creep.reserveController(this.creep.room.controller)) {
                this.creep.moveTo(this.creep.room.controller);
            }
        }

        return true;
    }
}

module.exports = CreepSettler;
