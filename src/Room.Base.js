'use strict';

/**
 * Wrapper class with basic logic for rooms.
 */
class RoomBase
{
    /**
     * Initializes a new instance of the RoomBase class with the specified room.
     * 
     * @param {Room} room - The room to be wrapped.
     */
    constructor(room)
    {
        this.room = room;
    }
    
    getSourceIds()
    {
        if (this.getMem("sources") === null) 
        {
            let mySources = [];
            let sources = this.room.find(FIND_SOURCES);
            
            for (let source of sources)
            {
                mySources.push(source.id);
            }
            
            this.setMem("sources", mySources);
        }
        
        return this.getMem("sources");
    }
    
    /**
     * Get something from the room memory. 
     * 
     * @returns {object} The value stored under the given key. null if not found.
     */
    getMem(key)
    {
        if (typeof this.room.memory[key] != 'undefined') 
        {
            return this.room.memory[key];
        }
        
        return null;
    }
    
    /**
     * Store a value to the room memory under the given key.
     * 
     * @param {string} key - The key assigned to the storage.
     * @param {value} value - The value to be stored under the key.
     */
    setValue(key, value) 
    {
        if (this.room.memory[key] !== value) 
        {
            this.room.memory[key] = value;
        }
    }
}

module.exports = RoomBase;
