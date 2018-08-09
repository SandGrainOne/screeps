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
            this._mem = Memory.rooms[name];
        }
        else {
            this._mem = {};
        }

        if (!this._mem.state) {
            this._mem.state = C.ROOM_STATE_NORMAL;
        }

        if (!this._mem.update) {
            this._mem.update = {};
        }

        if (!this._mem.update.last) {
            this._mem.update.last = 0;
        }

        if (!this._mem.update.next) {
            this._mem.update.next = 0;
        }

        if (!this._mem.reservations) {
            this._mem.reservations = {};
        }

        if (!this._mem.jobs) {
            this._mem.jobs = { 
                settlers: 0,
                builders: 0,
                upgraders: 0,
                haulers: 0,
                miners: 0,
                mineralminers: 0,
                refuelers: 0
            };
        }

        if (this._mem.wallcount) {
            this._mem.wallcount = 0;
        }

        if (this._mem.rampcount) {
            this._mem.rampcount = 0;
        }
    }

    /**
     * Gets the name of the room.
     */
    get name() {
        return this._name;
    }

    /**
     * Gets a value indicating whether the room is visible or not.
     */
    get isVisible() {
        return this._visible;
    }

    /**
     * Gets the state of the room.
     */
    get state() {
        return this._mem.state;
    }

    /**
     * Gets the room type.
     */
    get type() {
        return this._mem.type;
    }

    /**
     * Gets an object with all jobs in the room.
     */
    get jobs() {
        return this._mem.jobs;
    }

    getJobsFor(jobName) {
        if (!this._mem.jobs || !this._mem.jobs[jobName + "s"]) {
            return 0;
        }
        return this._mem.jobs[jobName + "s"];
    }

    populate() {

    }
}

module.exports = RoomBase;
