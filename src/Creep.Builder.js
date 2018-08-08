'use strict';

let CreepWorker = require('Creep.Worker');

/**
 * Wrapper class for creeps with logic for a repairer.
 */
class CreepBuilder extends CreepWorker
{   
    /**
     * Initializes a new instance of the CreepBuilder class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep)
    {
        super(creep);
        this.activity = "building";
    }
    
    /**
     * Perform building related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work()
    {
        if (this.getTask() === "harvesting")
        {
            if (this.creep.carry.energy < this.creep.carryCapacity) 
            {
                if (!this.findStoredEnergy())
                {
                    let source = this.creep.pos.findClosestByPath(FIND_SOURCES);
                    
                    if (source !== null)
                    {
                        if (this.creep.harvest(source) === ERR_NOT_IN_RANGE)
                        {
                            this.creep.moveTo(source);
                        }
                    }
                }
            }
            else
            {
                this.setTask("building");
            }
        }
        else
        {
            if (this.creep.carry.energy > 0) 
            {
                let target = this.creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                        
                if (this.creep.build(target) === ERR_NOT_IN_RANGE)
                {
                    this.creep.moveTo(target);
                }
            }
            else
            {
                this.setTask("harvesting");
            }
        }
        
        return true;
    }
}

module.exports = CreepBuilder;
