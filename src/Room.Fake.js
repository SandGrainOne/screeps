'use strict';

/**
 * This class is used to create a fake room from memory if a room is out of view.
 */
class RoomFake {
    /**
     * Initializes a new instance of the RoomFake class with the specified room.
     * 
     * @param {string} name - The name of the room
     */
    constructor(name) {
        this.name = name;
        this.mem = Memory.rooms[name];
    }

    /**
     * Gets the name of the room.
     */
    get Name() {
        return this.name;
    }

    /**
     * Gets the state of the room.
     */
    get State() {
        if (this.mem) {
            return this.mem.state;
        }
        return "normal";
    }

    getMiningNode(name) {
        return null;
    }
}

module.exports = RoomFake;
