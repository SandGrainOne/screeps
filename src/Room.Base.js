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

        if (Memory.rooms[name] !== undefined) {
            this._mem = Memory.rooms[name];
        }
        else {
            this._mem = {};
        }

        if (this._mem.jobs === undefined) {
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
     * Gets a value indicating whether the room is owned or not.
     */
    get isMine () {
        return false;
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

    /**
     * Perform all room specific logic.
     */
    run () {
    }

    /**
     * Create a list of jobs that needs to be occupied by creeps.
     */
    createJobs () {
    }

    getOwnedRooms () {
        if (this._mem.ownedRooms === undefined) {
            return [];
        }

        let ownedRooms = [];
        for (const roomDistance of this._mem.ownedRooms) {
            const roomName = roomDistance.name;
            ownedRooms.push(Empire.getRoom(roomName));
        }

        return ownedRooms;
    }
}

module.exports = RoomBase;
