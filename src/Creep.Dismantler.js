'use strict';

let C = require('constants');

let CreepWorker = require('Creep.Worker');

/**
 * Wrapper class for creeps with logic for a broker.
 * Primary purpose of these creeps are to move energy between links, storage and terminal.
 */
class CreepDismantler extends CreepWorker {   
    /**
     * Initializes a new instance of the CreepBroker class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep) {
        super(creep);
    }
    
    /**
     * Perform broker related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        if (this.AtWork && this.AtHome) {
            this.creep.say("Strike");
            return true;
        }

        let carry = _.sum(this.creep.carry);

        if (this.IsWorking) {
            if (this.moveToRoom(this.WorkRoom.name)) {
                if (carry >= this.creep.carryCapacity) {
                    //this.IsWorking = false;
                }
        
                let tower = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                    filter: function (structure) { 
                        return structure.structureType === STRUCTURE_TOWER; 
                    } 
                });

                if (tower) {
                    if (this.creep.dismantle(tower) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(tower);
                    }
                    return true;
                } 

                let spawn = this.creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, { 
                    filter: (s) => s.structureType === STRUCTURE_SPAWN
                });
                if (spawn) {
                    if (this.creep.dismantle(spawn) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(spawn);
                    }
                    return true;
                }
        
                let building = this.creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, { 
                    filter: function (s) { 
                        return s.structureType !== STRUCTURE_CONTROLLER; 
                    } 
                });
                if (building) {
                    if (this.creep.dismantle(building) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(building);
                    }
                    return true;
                } 
            }
        }
        else {
            if (this.moveToRoom(this.HomeRoom.name)) {
                if (carry === 0) {
                    this.IsWorking = true;
                }
                let storage = this.Room.Storage;

                if (storage) {
                    if (this.creep.pos.isNearTo(storage)) {
                        let space = storage.storeCapacity - _.sum(storage.store);
                        for(let resourceType in this.creep.carry) {
                            if (this.creep.transfer(storage, resourceType) === OK) {
                                let amount = this.creep.carry[resourceType];
                                let transfered = Math.min(space, amount);
                            }
                        }
                    }
                    else {
                        this.moveTo(storage);
                    }
                    return true;
                }
            }
        }

        return true;
    }
}

module.exports = CreepDismantler;
