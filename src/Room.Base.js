'use strict';

let C = require('constants');

/**
 * This class is a wrapper for the room memory. It can not be used to wrap an actual room object, 
 * but is a simplified room for when the actual room is out of view.
 */
class RoomBase {
    /**
     * Initializes a new instance of the RoomBase class.
     * 
     * @param {string} name - The name of the room
     */
    constructor(name) {
        this.name = name;
        this.mem = Memory.rooms[name];
        this.init();
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
        return this.mem.state;
    }

    /**
     * Gets the room type.
     */
    get Type() {
        return this.mem.type;
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

    getContainers() {
        return [];
    }
    /**
     * Initializes the room memory with default values.
     */
    init() {
        if (!this.mem.state) {
            this.mem.state = C.ROOM_STATE_NORMAL;
        }

        if (!this.mem.update) {
            this.mem.update = {};
            this.mem.update.last = 0;
            this.mem.update.next = 0;
        }

        if (!this.mem.resources) {
            this.mem.resources = {};
            this.mem.resources.sources = [];
            this.mem.resources.minerals = [];
            this.mem.resources.refresh = true;
        }

        if (!this.mem.structures) {
            this.mem.structures = {};
            this.mem.structures.containers = [];
            this.mem.structures.links = {};
            this.mem.structures.links.storage = null;
            this.mem.structures.links.controller = null;
            this.mem.structures.links.inputs = [];
        }
    }

    /**
     * Empty method. Can't do anything without access to the actual room.
     * (Might add some logic later if there are things that can be done based on memory alone.)
     */
    update() {
        // Does nothing without the actual room object from the game.
    }
}

module.exports = RoomBase;
