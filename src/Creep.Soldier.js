'use strict';

let CreepBase = require('Creep.Base');

/**
 * Wrapper class for creeps with logic for war.
 */
class CreepSoldier extends CreepBase {   
    /**
     * Initializes a new instance of the CreepSoldier class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep) {
        super(creep);
    }

    /**
     * Perform a retreat if there is an enemy creep or tower attacking the creep.
     * 
     * @returns {Boolean} true if the retreat was required and the creep is on the move
     */
    retreat() {
        return false;
    }
    
    /**
     * Perform war related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        return false;
    }
}

module.exports = CreepSoldier;
