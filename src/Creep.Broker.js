'use strict';

let C = require('constants');

let CreepWorker = require('Creep.Worker');

/**
 * Wrapper class for creeps with logic for a broker.
 * Primary purpose of these creeps are to move energy between links, storage and terminal.
 */
class CreepBroker extends CreepWorker {   
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
        let storage = this.Room.Storage;
        let link = this.creep.pos.findClosestByPath(this.Room.getReceivingLinks());
        
        if (link && this.creep.pos.isNearTo(link)) {
            this.creep.withdraw(link, RESOURCE_ENERGY);
        }

        if (storage && this.creep.pos.isNearTo(storage)) {
            this.creep.transfer(storage, RESOURCE_ENERGY);
        }
        
        if (storage && !this.creep.pos.isNearTo(storage)) {
            this.moveTo(storage);
        }
        
        if (link && !this.creep.pos.isNearTo(link)) {
            this.moveTo(link);
        }
        
        return true;
    }
}

module.exports = CreepBroker;
