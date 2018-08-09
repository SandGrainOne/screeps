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
            if (this.moveOut()) {
                if (carry >= this.creep.carryCapacity) {
                    this.IsWorking = false;
                }

                let structure = this.creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, { 
                    filter: (s) => s.structureType === STRUCTURE_EXTRACTOR
                });
                if (structure) {
                    if (this.creep.dismantle(structure) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(structure);
                    }
                    return true;
                }
        
                let container = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                    filter: function (structure) { 
                        return structure.structureType === STRUCTURE_CONTAINER; 
                    } 
                });
                if (container) {
                    if (this.creep.dismantle(container) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(container);
                    }
                    return true;
                } 
            }
        }
        else {
            if (this.moveHome()) {
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
