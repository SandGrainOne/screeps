'use strict';

let CreepBase = require('Creep.Base');

/**
 * Wrapper class for creeps with worker related logic.
 */
class CreepWorker extends CreepBase
{   
    /**
     * Initializes a new instance of the CreepWorker class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep)
    {
        super(creep);
    }
    
    /**
     * Perform work related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work()
    {
        return false;
    }
    
    /**
     * Logic that tries to find a source of stored energy in current room and withdraw as much as possible.
     */
    findStoredEnergy()
    {
        let roomStorage = this.creep.room.storage;

        if (roomStorage !== undefined && roomStorage.store[RESOURCE_ENERGY] > 0)
        {
            if (this.creep.withdraw(roomStorage, RESOURCE_ENERGY) !== OK)
            {
                this.creep.moveTo(roomStorage);
            }
            
            return true;
        }
        
        let container = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
            filter: function (structure) { 
                return structure.structureType === STRUCTURE_CONTAINER && (structure.store.energy > 0); 
            } 
        });

        if (container !== null)
        {
            if (this.creep.withdraw(container, RESOURCE_ENERGY) !== OK)
            {
                this.creep.moveTo(container);
            }
            
            return true;
        }
        
        return false;
    }
}

module.exports = CreepWorker;
