'use strict';

let C = require('constants');

let CreepBase = require('Creep.Base');

/**
 * Wrapper class for creeps with logic for a broker.
 * Primary purpose of these creeps are to move energy between links, storage and terminal.
 */
class CreepBroker extends CreepBase {   
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
        if (this.creep.carry.energy > 0) {
            let storage = this.creep.room.storage;
            
            if (storage !== undefined) {
                if (this.creep.pos.isNearTo(storage)) {
                    this.creep.transfer(storage, RESOURCE_ENERGY);
                }
                else {
                    this.creep.moveTo(storage);
                }
            }
        }
        else {
            let link = this.creep.pos.findClosestByPath(this.Room.getReceivingLinks())
            if (link && link.energy) {
                if (this.creep.withdraw(link, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(link);
                }
            }
        }
        
        return true;
    }
}

module.exports = CreepBroker;
