'use strict';

let C = require('constants');

let CreepBase = require('Creep.Base');

/**
 * Wrapper class for creeps with logic for a hauler.
 * Primary purpose of these creeps are to move resources from the perimeter of a room and into the center.
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
            if (this.creep.carry.energy < this.creep.carryCapacity) {
                if (this.moveOut()) {
                    
                    let container = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                        filter: function (s) { 
                            return s.structureType === STRUCTURE_CONTAINER && s.store.energy > 600; 
                        } 
                    });

                    if (container !== null) {
                        if (this.creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            this.creep.moveTo(container);
                        }
                        return true;
                    }
                    
                    // The hauler will usually move close to places where there can be dropped energy.
                    let drops = this.creep.pos.findInRange(FIND_DROPPED_ENERGY, 2);

                    if (drops.length && drops[0].amount > 50) {
                        if (this.creep.pickup(drops[0]) === ERR_NOT_IN_RANGE)  {
                            this.creep.moveTo(drops[0]);
                        }
                        return true;
                    }
                }
            }
            else {
                this.Task = "delivering";
            }
        }
        else {
            if (this.creep.carry.energy > 0) {
                if (this.moveHome()) {
                    let link = this.creep.pos.findClosestByPath(this.Room.getSendingLinks())
                    if (link && this.creep.pos.getRangeTo(link) <= 5 && link.energy < 600) {
                        if (this.creep.transfer(link, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            this.creep.moveTo(link);
                        }
                        return true;
                    }
                    
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
            }
            else {
                this.Task = "hauling";
            }
        }
        
        return true;
    }
}

module.exports = CreepHauler;
