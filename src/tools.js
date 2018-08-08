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
                console.log(creepName + " has died. Removing from memory.");
                delete Memory.creeps[creepName];
            }
        }
    },
    
    /**
     * Get a random integer between "min" and "max".
     * 
     * @param {number} min - min number
     * @param {number} max - max number
     * @return {int} a random integer
     */
    getRandomInt: function (min, max) 
    {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

module.exports = tools;