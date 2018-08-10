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
        if(!this.atWork) {
            this.moveToRoom(this.WorkRoom.name);
            return true;
        }
        
        let flagAttack = this.creep.pos.findClosestByRange(FIND_FLAGS, { filter: (f) => f.color === COLOR_RED });

        if (flagAttack) {
            this.creep.moveTo(flagAttack);
        }
        
        let target = this.creep.pos.findClosestByRange(FIND_MY_CREEPS, { filter: (c) => c.hits < c.hitsMax });
        if (target) {
            this.creep.moveTo(target);
            if (this.creep.pos.isNearTo(target)) {
                this.creep.heal(target);
            }
            else {
                this.creep.rangedHeal(target);
            }
        }

        if (this.creep.hits < this.creep.hitsMax) {
            this.creep.heal(this.creep);
        }
        
        let hostileCreep = this.creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        
        if (hostileCreep) {            
            if (this.creep.pos.getRangeTo(hostileCreep) < 3){
                let flagRetreat = this.creep.pos.findClosestByRange(FIND_FLAGS, { filter: (f) => f.color === COLOR_BLUE });
                this.creep.moveTo(flagRetreat);
            }
        }

        return true;
    }
}

module.exports = CreepHealer;
