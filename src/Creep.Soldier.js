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
     * Perform mining related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        if (this.moveOut()) {
            let hostileCreep = this.creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (hostileCreep !== null) {
                let attackResult = this.creep.rangedAttack(hostileCreep);
                if (attackResult === ERR_NOT_IN_RANGE) {
                    let moveResult = this.creep.moveTo(hostileCreep);
                }
                else {
                    this.moveIn();
                }
                return true;
            }

            let enemyStructure = this.creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, { filter: (it) => it.structureType != STRUCTURE_CONTROLLER });
            if (enemyStructure !== null) {
                if (this.creep.attack(enemyStructure) === ERR_NOT_IN_RANGE) {
                    let moveResult = this.creep.moveTo(enemyStructure);
                }
                return true;
            }
        }

        return true;
    }
}

module.exports = CreepSoldier;
