'use strict';

let CreepBase = require('./Creep.Base');

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

    /**
     * This function is a wrapper for creep.attack().
     * Currently has no logic of its own.
     * 
     * @param {Creep, Structure} target - The target object to be attacked.
     * 
     * @returns {int} A code indicating the result of the function call.
     */
    attack(target) {
        return this._creep.attack(target);
    }

    /**
     * This function is a wrapper for creep.rangedAttack().
     * Currently has no logic of its own.
     * 
     * @param {Creep, Structure} target - The target object to be attacked.
     * 
     * @returns {int} A code indicating the result of the function call.
     */
    rangedAttack(target) {
        return this._creep.rangedAttack(target);
    }
}

module.exports = CreepSoldier;
