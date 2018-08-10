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
        if (this.atWork && this.isHome) {
            this.say("Strike");
            return true;
        }

        let carry = _.sum(this.carry);

        if (this.isWorking) {
            if (this.moveToRoom(this.WorkRoom.name)) {
        
                let tower = this.pos.findClosestByPath(FIND_STRUCTURES, { 
                    filter: function (structure) { 
                        return structure.structureType === STRUCTURE_TOWER; 
                    } 
                });

                if (tower) {
                    if (this._creep.dismantle(tower) === ERR_NOT_IN_RANGE) {
                        this.moveTo(tower);
                    }
                    return true;
                } 

                let spawn = this.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, { 
                    filter: (s) => s.structureType === STRUCTURE_SPAWN
                });
                if (spawn) {
                    if (this._creep.dismantle(spawn) === ERR_NOT_IN_RANGE) {
                        this.moveTo(spawn);
                    }
                    return true;
                }
        
                let building = this.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, { 
                    filter: function (s) { 
                        return s.structureType !== STRUCTURE_CONTROLLER; 
                    } 
                });
                if (building) {
                    if (this._creep.dismantle(building) === ERR_NOT_IN_RANGE) {
                        this.moveTo(building);
                    }
                    return true;
                } 
            }
        }
        else {
            if (this.moveToRoom(this.HomeRoom.name)) {
                if (carry === 0) {
                    this.isWorking = true;
                }
                let storage = this.room.storage;

                if (storage) {
                    if (this.pos.isNearTo(storage)) {
                        let space = storage.storeCapacity - _.sum(storage.store);
                        for (let resourceType in this.carry) {
                            if (this.transfer(storage, resourceType) === OK) {
                                let amount = this.carry[resourceType];
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
