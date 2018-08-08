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
        if (this.moveOut()) {
            if (this.Room.Name === "W4N77") {
                let weakWall = Game.getObjectById("586c7145f52dba5c45784bb3");

                if (!!weakWall) {
                    if (this.creep.attack(weakWall) == ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(weakWall);
                    }                
                    return true;
                }

                let hostileCreep = this.creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (hostileCreep !== null) {
                    let attackResult = this.creep.attack(hostileCreep);
                    if (attackResult === ERR_NOT_IN_RANGE) {
                        let moveResult = this.creep.moveTo(hostileCreep);
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
            
            let hostileCreep = this.creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (hostileCreep !== null) {
                let attackResult = this.creep.attack(hostileCreep);
                if (attackResult === ERR_NOT_IN_RANGE) {
                    let moveResult = this.creep.moveTo(hostileCreep);
                    console.log(moveResult);
                }
            }
            else {
                if (this.creep.room.controller.owner && this.creep.room.controller.owner.username === "Dusch") {

                    let enemyStructure = this.creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, { filter: (it) => it.structureType != STRUCTURE_CONTROLLER });
                    
                    if (enemyStructure !== null) {
                        if (this.creep.attack(enemyStructure) === ERR_NOT_IN_RANGE) {
                            let moveResult = this.creep.moveTo(enemyStructure);
                        }
                    }
                    else {
                        if (enemyStructure !== null) {
                            if (this.creep.attack(enemyStructure) === ERR_NOT_IN_RANGE) {
                                let moveResult = this.creep.moveTo(enemyStructure);
                            }
                            return true;
                        }
                    }
                    
                }
                else {
                    let enemyStructure = this.creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, { filter: (it) => it.structureType != STRUCTURE_CONTROLLER });
                    
                    if (enemyStructure !== null) {
                        if (this.creep.attack(enemyStructure) === ERR_NOT_IN_RANGE) {
                            let moveResult = this.creep.moveTo(enemyStructure);
                        }
                    }
                    else {
                        let enemyConstructionSite = this.creep.pos.findClosestByRange(FIND_HOSTILE_CONSTRUCTION_SITES);
                        
                        if (enemyConstructionSite !== null) {
                            this.creep.moveTo(enemyConstructionSite);
                        }
                        else {
                            if (!this.creep.pos.isEqualTo(15, 15)) {
                                let moveResult = this.creep.moveTo(15, 15);
                            }
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
