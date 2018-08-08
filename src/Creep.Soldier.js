'use strict';

let CreepBase = require('Creep.Base');

/**
 * Wrapper class for creeps with logic for a remote miner.
 */
class CreepSoldier extends CreepBase {   
    /**
     * Initializes a new instance of the CreepMiner class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep) {
        super(creep);
        this.activity = "guarding";
    }

    get HomeRoom() {
        return this.getMem("homeroom");
    }

    get RemoteRoom() {
        return this.getMem("remoteroom");
    }
    
    /**
     * Perform mining related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        if (this.getRoom().room.name !== this.RemoteRoom) {
            let exitDir = this.getRoom().room.findExitTo(this.RemoteRoom);
            let exit = this.creep.pos.findClosestByRange(exitDir);
            this.creep.moveTo(exit);
        }
        else {
            let hostileCreep = this.creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (hostileCreep !== null) {
                if (this.creep.attack(hostileCreep) === ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(hostileCreep);
                }
            }
            else {
                let enemyStructure = this.creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, { filter: (it) => it.structureType != STRUCTURE_CONTROLLER });
                
                if (enemyStructure !== null) {
                    if (this.creep.attack(enemyStructure) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(enemyStructure);
                    }
                }
                else {                    
                    let enemyConstructionSite = this.creep.pos.findClosestByRange(FIND_HOSTILE_CONSTRUCTION_SITES);
                    
                    if (enemyConstructionSite !== null) {
                        this.creep.moveTo(enemyConstructionSite);
                    }
                    else {
                        if (!this.creep.pos.isNearTo(30, 15)) {
                            this.creep.moveTo(30, 15);
                        }
                    }
                }
            }
        }

        return true;
    }
    
    /**
     * Perform soldier specific retirement logic. 
     * A soldier never retires.
     * 
     * @returns {Boolean} Always false.
     */
    retire() {
        return false; 
    }
}

module.exports = CreepSoldier;
