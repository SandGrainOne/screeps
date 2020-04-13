'use strict';

let CreepBase = require('./Creep.Base');

/**
 * Wrapper class for creeps with logic for war.
 */
class CreepSoldier extends CreepBase {
    /**
     * Determine what task the creep should undertake this tick.
     */
    getTask () {
        let task = super.getTask();
        if (task !== null) {
            return task;
        }

        return null;
    }

    /**
     * Perform war related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work () {
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
    attack (target) {
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
    rangedAttack (target) {
        return this._creep.rangedAttack(target);
    }
}

module.exports = CreepSoldier;
