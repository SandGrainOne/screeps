'use strict';

let CreepBase = require('Creep.Base');

/**
 * Wrapper class for creeps with logic for a miner.
 */
class CreepHauler extends CreepBase {   
    /**
     * Initializes a new instance of the CreepHauler class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep) {
        super(creep);
    }
    
    /**
     * Perform hauling related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        if (this.Task === "hauling")  {
            if (this.creep.carry.energy < this.creep.carryCapacity / 2) {
                // The hauler will usually move close to places where there can be dropped energy.
                let drops = this.creep.pos.findInRange(FIND_DROPPED_ENERGY, 2);

                if (drops.length > 0 && drops[0].amount > 10) {
                    if (this.creep.pickup(drops[0]) == ERR_NOT_IN_RANGE)  {
                        this.creep.moveTo(drops[0]);
                    }
                }
                else {
                    let inLink = Game.getObjectById("5878e5303393edb0108b660e");
                    if (inLink && inLink.energy && this.Room.Name === "W3N79") {
                        if (this.creep.withdraw(inLink, RESOURCE_ENERGY) !== OK) {
                                this.creep.moveTo(inLink);
                        }
                    }
                    else {
                        let container = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                            filter: function (structure) { 
                                return structure.structureType === STRUCTURE_CONTAINER && (structure.store.energy > 600); 
                            } 
                        });

                        if (container !== null) {
                            if (this.creep.withdraw(container, RESOURCE_ENERGY) !== OK) {
                                this.creep.moveTo(container);
                            }
                        }
                    }
                }
            }
            else {
                this.Task = "delivering";
            }
        }
        else {
            if (this.creep.carry.energy > 0) {
                let spawn = this.creep.pos.findClosestByPath(FIND_MY_SPAWNS);
                if (spawn !== null && spawn.energy < spawn.energyCapacity) {
                    if (this.creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(spawn);
                    }
                    return true;
                }

                let extension = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                    filter: function (object) { 
                        return object.structureType === STRUCTURE_EXTENSION && (object.energy < object.energyCapacity); 
                    } 
                });
                if (extension != undefined) {
                    if (this.creep.transfer(extension, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(extension);
                    }
                    return true;
                }

                let tower = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                    filter: function (object) { 
                        return object.structureType === STRUCTURE_TOWER && (object.energy < object.energyCapacity - 200); 
                    } 
                });

                if (tower != undefined) {
                    if (this.creep.transfer(tower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(tower);
                    }
                    return true;
                }

                let storage = this.creep.room.storage;
                
                if (storage !== undefined) {
                    if (this.creep.pos.isNearTo(storage)) {
                        this.creep.transfer(storage, RESOURCE_ENERGY);
                    }
                    else {
                        this.creep.moveTo(storage);
                    }
                    return true;
                }

                let container = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                    filter: function (object) { 
                        return object.structureType === STRUCTURE_CONTAINER;
                    } 
                });

                if (container !== undefined) {
                    if (this.creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(container);
                    }
                    return true;
                }

                if (spawn !== null && !this.creep.pos.inRangeTo(spawn, 2)) {
                    this.creep.moveTo(spawn);
                    return true;
                }
            }
            else {
                this.Task = "hauling";
            }
        }
        
        return true;
    }
}

module.exports = CreepHauler;
