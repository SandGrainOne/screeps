'use strict';

/**
 * Wrapper class with basic logic for rooms.
 */
class RoomBase {
    /**
     * Initializes a new instance of the RoomBase class with the specified room.
     * 
     * @param {Room} room - The room to be wrapped.
     */
    constructor(room) {
        this.room = room;
    }

    getMiningNode(creepName) {
        if (!this.getMem("sources")) {
            let infoList = [];
            for (let source of this.room.find(FIND_SOURCES)) {
                infoList.push({ sourceId: source.id, miner: null, px: 0, py: 0 });
            }

            this.setMem("sources", infoList);
        }

        for (let source of this.getMem("sources")) {
            if (source.miner === creepName) {
                return source;
            }
        }

        for (let source of this.getMem("sources")) {
            if (source.miner === undefined || source.miner === null) {
                source.miner = creepName;
                return source;
            }
        }

        return null;
    }

    removeMiner(creepName) {
        for (let source of this.getMem("sources")) {
            if (source.miner === creepName) {
                source.miner = null;
                return;
            }
        }
    }
    
    /**
     * Get something from the room memory. 
     * 
     * @returns {object} The value stored under the given key. null if not found.
     */
    getMem(key) {
        if (typeof this.room.memory[key] != 'undefined') {
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
    setMem(key, value) {
        if (this.room.memory[key] !== value) 
        {
            this.room.memory[key] = value;
        }
    }
}

module.exports = RoomBase;
