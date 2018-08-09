'use strict';

let RoomBase = require('Room.Base');

/**
 * This class is used to create a fake room from memory if a room is out of view.
 */
class RoomFake extends RoomBase {
    /**
     * Initializes a new instance of the RoomFake class with the specified room.
     * 
     * @param {string} name - The name of the room
     */
    constructor(name) {
        super(name);
    }

    getSourceNode(creepName) {
        let sources = this.mem.resources.sources;
        for (let source of sources) {
            if (source.miner === creepName) {
                return { id: source.id, pos: source.pos };
            }
        }
        for (let source of sources) {
            if (!source.miner) {
                source.miner = creepName;
                return { id: source.id, pos: source.pos };
            }
        }
        return null;
    }
}

module.exports = RoomFake;
