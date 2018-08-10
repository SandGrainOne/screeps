'use strict';

let CreepSoldier = require('./Creep.Soldier');

/**
 * Wrapper class for creeps with logic for an attacker.
 * Primary purpose of these creeps are to perform offencive actions with the goal of damaging hostile creeps and structures.
 */
class CreepAttacker extends CreepSoldier {   
    /**
     * Initializes a new instance of the CreepAttacker class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep) {
        super(creep);
    }
    
    /**
     * Perform attacker related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        if(!this.atWork) {
            this.moveToRoom(this.WorkRoom.name);
            return true;
        }
        
        let hostileCreep = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (hostileCreep) {
            if (this.room.isMine && this.room.ramparts > 0) {
                this.moveTo(hostileCreep);
                let ramps = hostileCreep.pos.findInRange(FIND_MY_STRUCTURES, 1, { filter: (s) => s.structureType === STRUCTURE_RAMPART })
                if (ramps.length > 0) {
                    if (!this.pos.isEqualTo(ramps[0])) {
                       this.moveTo(ramps[0]);
                    }
                }
                this.attack(hostileCreep);
            } 
            else {
                this.attack(hostileCreep);
                this.moveTo(hostileCreep);
            }
            return true;
        }

        let enemyStructure = this.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, { 
            filter: (it) => it.structureType != STRUCTURE_CONTROLLER && it.structureType != STRUCTURE_POWER_BANK
        });
        if (enemyStructure !== null) {
            if (this.attack(enemyStructure) === ERR_NOT_IN_RANGE) {
                let moveResult = this.moveTo(enemyStructure);
            }
            return true;
        }

        // Attack ?
        let flagAttack = this.pos.findClosestByRange(FIND_FLAGS, { filter: (f) => f.color === COLOR_RED });

        if (flagAttack) {
            this.moveTo(flagAttack);
        }

        return true;
    }
}

module.exports = CreepAttacker;
