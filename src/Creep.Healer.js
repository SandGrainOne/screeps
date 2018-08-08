'use strict';

let CreepSoldier = require('Creep.Soldier');

/**
 * Wrapper class for creeps with logic for a healer.
 */
class CreepHealer extends CreepSoldier {   
    /**
     * Initializes a new instance of the CreepHealer class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep) {
        super(creep);
    }
    
    /**
     * Perform healing related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        // Retreat ?
        if (this.creep.hits < this.creep.hitsMax / 2) {
            let flagRetreat = this.creep.pos.findClosestByRange(FIND_FLAGS, { filter: (f) => f.color === COLOR_BLUE });
            if (flagRetreat) {
                this.creep.moveTo(flagRetreat);
            }
            
            this.creep.heal(this.creep);

            return true;
        }

        // Attack ?
        let flagAttack = this.creep.pos.findClosestByRange(FIND_FLAGS, { filter: (f) => f.color === COLOR_RED });

        if (flagAttack) {
            this.creep.moveTo(flagAttack);
        }
        
        let target = this.creep.pos.findClosestByRange(FIND_MY_CREEPS, { filter: (c) => c.hits < c.hitsMax });
        if (target) {
            if (this.creep.heal(target) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(target);
            }
            return true;
        }

        return true;
    }
}

module.exports = CreepHealer;
