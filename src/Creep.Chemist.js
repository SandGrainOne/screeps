'use strict';

let C = require('constants');

let CreepWorker = require('Creep.Worker');

/**
 * Wrapper class for creeps with logic for a chemist.
 * Primary purpose of these creeps are to handle minerals
 */
class CreepChemist extends CreepWorker {   
    /**
     * Initializes a new instance of the CreepChemist class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep) {
        super(creep);
    }
    
    /**
     * Perform broker related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        if (!this.AtWork) {
            this.moveTo(this.moveToRoom(this.WorkRoom.Name, false));
            return true;
        }

        return true;
    }
}

module.exports = CreepChemist;
