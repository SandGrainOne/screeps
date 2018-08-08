'use strict';

let CreepBase = require('Creep.Base');

/**
 * Wrapper class for creeps with logic for a room defender.
 * Primary purpose of these creeps are to defend against attacks from enemies.
 */
class CreepDefender extends CreepBase {   
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
        let hostileCreep = this.creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (hostileCreep !== null) {
            let attackResult = this.creep.rangedAttack(hostileCreep);
            if (attackResult === ERR_NOT_IN_RANGE) {
                let moveResult = this.creep.moveTo(hostileCreep);
            }

            return true;
        }

        let flag = this.creep.pos.findClosestByRange(FIND_FLAGS);

        if (flag) {
            this.creep.moveTo(flag);
        }

        if (this.creep.hits < this.creep.hitsMax / 3) {
            this.creep.moveTo(this.Room.room.controller);
        }

        return true;
    }
}

module.exports = CreepDefender;
