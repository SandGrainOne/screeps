'use strict';

let CreepBase = require('Creep.Base');

/**
 * Wrapper class for creeps with logic for an upgrader.
 */
class CreepUpgrader extends CreepBase
{   
    /**
     * Initializes a new instance of the CreepUpgrader class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep)
    {
        super(creep);
        this.activity = "upgrading";
    }
    
    /**
     * Perform upgrading related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work()
    {
        if (this.creep.carry.energy < this.creep.carryCapacity)
        {
            
        }
        
        return false;
    }
}

module.exports = CreepUpgrader;
