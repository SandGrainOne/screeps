'use strict';

let C = require('constants');

let CreepWorker = require('Creep.Worker');

/**
 * Wrapper class for creeps with logic for a refueler.
 * Primary purpose of these creeps are to keep the towers, spawn and extensions stocked with energy in that order.
 */
class CreepRefueler extends CreepWorker {   
    /**
     * Initializes a new instance of the CreepRefueler class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep) {
        super(creep);
    }
    
    /**
     * Perform refueling related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        if (!this.moveHome()) return true;
        if (this.creep.carry.energy > 0) { 
            if (this.Room.State !== C.ROOM_STATE_NORMAL) {
                let tower = this.creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { 
                    filter: function (s) { 
                        return s.structureType === STRUCTURE_TOWER && (s.energy < s.energyCapacity - 200); 
                    } 
                });
    
                if (tower) {
                    if (this.creep.transfer(tower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(tower);
                    }
                    return true;
                }
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
            
            let tower = this.creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { 
                filter: function (s) { 
                    return s.structureType === STRUCTURE_TOWER && (s.energy < s.energyCapacity - 200); 
                } 
            });

            if (tower) {
                if (this.creep.transfer(tower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(tower);
                }
                return true;
            }
        }
        else {
            let storage = this.Room.Storage;            
            if (storage) {
                if (this.creep.pos.isNearTo(storage)) {
                    this.creep.withdraw(storage, RESOURCE_ENERGY);
                }
                else {
                    this.creep.moveTo(storage);
                }
            }
        }
        
        return true;
    }
}

module.exports = CreepRefueler;
