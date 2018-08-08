'use strict';

/**
 * Global tools and utilities
 */
let tools = 
{
    /**
     * Clean the memory for all dead creeps.
     */
    cleanMemory: function () 
    {
        // Loop through all creeps in memory
        for (let creepName in Memory.creeps)
        {
            // Check if the creep is dead.
            if (Game.creeps[creepName] === undefined) 
            {
                delete Memory.creeps[creepName];
            }
        }
    }
}

module.exports = tools;