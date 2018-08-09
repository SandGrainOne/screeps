'use strict';

let C = require('constants');

let CreepWorker = require('Creep.Worker');

/**
 * Wrapper class for creeps with logic for a refueler.
 * Primary purpose of these creeps are to keep the towers, spawn and extensions stocked with energy in that order.
 */
class CreepBalancer extends CreepWorker {

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
        let carry = _.sum(this.creep.carry);
        if (carry > 0) { 
            if (this.moveHome()) {
                if (carry === this.creep.carry.energy) {
                    let link = this.creep.pos.findClosestByPath(this.Room.Links.Inputs)
                    if (link && this.creep.pos.getRangeTo(link) <= 5 && link.energy < 600) {
                        let transferResult = this.creep.transfer(link, RESOURCE_ENERGY);
                        if (transferResult === ERR_NOT_IN_RANGE) {
                            this.moveTo(link);
                            return true;
                        }
                    }
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
        else {
            if (this.moveOut()) {
                let storage = this.Room.Storage;
                if (storage) {
                    if (this.creep.pos.isNearTo(storage)) {
                        let amount = storage.store.energy;
                        if (amount > 0) {
                            this.creep.withdraw(storage, RESOURCE_ENERGY);
                        }
                    }
                    else {
                        this.moveTo(this.Room.Storage);
                    }
                }
            }
        }
        
        return true;
    }
}

module.exports = CreepBalancer;
