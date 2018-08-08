'use strict';

/**
 * Wrapper class with basic logic for creeps.
 */
class CreepBase
{
    /**
     * Initializes a new instance of the CreepBase class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped with
     */
    constructor(creep)
    {
        this.creep = creep;
    }
    
    /**
     * Run all creep logic.
     * 
     * @returns {Boolean} true if the action was successful
     */
    act()
    {
        if (this.retire())
        {
            return true;
        }
        
        if (this.retreat())
        {
            return true;
        }

        if (this.work())
        {
            return true;
        }
        
        return false;
    }
    
    /**
     * Perform a retreat if it's needed.
     * 
     * @returns {Boolean} true if the retreat was required and the creep is on the move
     */
    retire()
    {
        return false; 
    }
    
    /**
     * Perform a retreat if it's needed.
     * 
     * @returns {Boolean} true if the retreat was required and the creep is on the move
     */
    retreat()
    {
        return false;
    }
    
    /**
     * Perform job related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work()
    {
        return true;
    }
    
    /**
     * Make the creep say a message.
     * 
     * @param {string} message - The message to be said
     */
    say(message)
    {
        this.creep.say(message);
    }
}

module.exports = CreepBase;
