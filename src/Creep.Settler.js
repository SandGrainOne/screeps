'use strict';

let CreepBase = require('Creep.Base');

/**
 * Wrapper class for creeps with logic for a remote miner.
 */
class CreepSettler extends CreepBase {   
    /**
     * Initializes a new instance of the CreepMiner class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep) {
        super(creep);
    }
    
    /**
     * Perform mining related logic.
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
    
    /**
     * Perform settler specific retirement logic. 
     * A settler never retires.
     * 
     * @returns {Boolean} Always false.
     */
    retire() {
        return false; 
    }
}

module.exports = CreepSettler;
