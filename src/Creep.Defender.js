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
        let hostileCreep = this.creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (hostileCreep) {
            if (this.Room.Controller && this.Room.Controller.my && this.Room.mem.rampcount > 0) {
                let ramps = hostileCreep.pos.findInRange(FIND_MY_STRUCTURES, 1, { filter: (s) => s.structureType === STRUCTURE_RAMPART })
                if (ramps.length > 0) {
                    if (!this.creep.pos.isEqualTo(ramps[0])) {
                       this.creep.moveTo(ramps[0]);
                    }
                }
                this.creep.attack(hostileCreep);
            } 
            else {
                this.creep.attack(hostileCreep);
                this.creep.moveTo(hostileCreep);
            }
            return true;
        }

        let enemyStructure = this.creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, { 
            filter: (it) => it.structureType != STRUCTURE_CONTROLLER && it.structureType != STRUCTURE_POWER_BANK
        });
        if (enemyStructure !== null) {
            if (this.creep.attack(enemyStructure) === ERR_NOT_IN_RANGE) {
                let moveResult = this.creep.moveTo(enemyStructure);
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