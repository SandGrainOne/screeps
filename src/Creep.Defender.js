'use strict';

let CreepSoldier = require('Creep.Soldier');

/**
 * Wrapper class for creeps with logic for a room defender.
 * Primary purpose of these creeps are to defend against attacks from enemies.
 */
class CreepDefender extends CreepSoldier {   
    /**
     * Initializes a new instance of the CreepDefender class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep) {
        super(creep);
    }
    
    /**
     * Perform defence related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {     
        // Retreat ?
        if (this.creep.hits < this.creep.hitsMax / 2) {
            let flagRetreat = this.creep.pos.findClosestByRange(FIND_FLAGS, { filter: (f) => f.color === COLOR_BLUE });
            if (flagRetreat) {
                this.creep.moveTo(flagRetreat);
                return true;
            }
        }
        
        let hostileCreep = this.creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        
        if (hostileCreep) {            
            let attackResult = this.creep.rangedAttack(hostileCreep);
            let rangeToCreep = this.creep.pos.getRangeTo(hostileCreep);
            
            if (rangeToCreep > 3) {
                this.creep.moveTo(hostileCreep);
            }
            
            if (rangeToCreep < 3){
                let flagRetreat = this.creep.pos.findClosestByRange(FIND_FLAGS, { filter: (f) => f.color === COLOR_BLUE });
                this.creep.moveTo(flagRetreat);
            }

            return true;
        }

        // Attack ?
        let flagAttack = this.creep.pos.findClosestByRange(FIND_FLAGS, { filter: (f) => f.color === COLOR_RED });

        if (flagAttack) {
            this.creep.moveTo(flagAttack);
        }

        return true;
    }
}

module.exports = CreepDefender;
