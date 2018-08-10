'use strict';

let C = require('./constants');

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
    constructor (name) {
        this._name = name;
        this._visible = false;

        if (!_.isUndefined(Memory.rooms) && !_.isUndefined(Memory.rooms[name])) {
            this._mem = Memory.rooms[name];
        }
        else {
            this._mem = {};
        }

        if (_.isUndefined(this._mem.resources)) {
            this._mem.resources = {};
        }

        if (_.isUndefined(this._mem.structures)) {
            this._mem.structures = {};
        }

        if (_.isUndefined(this._mem.jobs)) {
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
    }

    /**
     * Gets the name of the room.
     */
    get name () {
        return this._name;
    }

    /**
     * Gets a value indicating whether the room is visible or not.
     */
    get isVisible () {
        return this._visible;
    }

    /**
     * Gets the state of the room.
     */
    get state () {
        return _.isUndefined(this._mem.state) ? C.ROOM_STATE_NORMAL : this._mem.state;
    }

    /**
     * Sets the state of the room.
     */
    set state (value) {
        this._mem.state = value;
    }

    /**
     * Gets the room type.
     */
    get type () {
        return this._mem.type;
    }

    /**
     * Gets an object with all jobs in the room.
     */
    get jobs () {
        return this._mem.jobs;
    }

    getJobsFor (jobName) {
        if (!this._mem.jobs || !this._mem.jobs[jobName + 's']) {
            return 0;
        }
        return this._mem.jobs[jobName + 's'];
    }

    createJobs () {

    }
}

module.exports = RoomBase;
