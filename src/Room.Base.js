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
        this._name = name;
        this._visible = false;

        if (Memory.rooms[name]) {
            this.mem = Memory.rooms[name];
        }
        else {
            this.mem = {};
        }

        if (!this.mem.state) {
            this.mem.state = C.ROOM_STATE_NORMAL;
        }

        if (!this.mem.update) {
            this.mem.update = {};
        }

        if (!this.mem.update.last) {
            this.mem.update.last = 0;
        }

        if (!this.mem.update.next) {
            this.mem.update.next = 0;
        }

        if (!this.mem.reservations) {
            this.mem.reservations = {};
        }

        if (!this.mem.wallcount) {
            this.mem.wallcount = 0;
        }

        if (!this.mem.rampcount) {
            this.mem.rampcount = 0;
        }
    }

    /**
     * Gets the name of the room.
     */
    get Name() {
        return this._name;
    }

    /**
     * Gets a value indicating whether the room is visible or not.
     */
    get IsVisible() {
        return this._visible;
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
}

module.exports = RoomBase;
