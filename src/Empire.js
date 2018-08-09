'use strict';

let CreepFactory = require('CreepFactory');

let RoomBase = require('Room.Base');
let RoomReal = require('Room.Real');

/**
 * The Empire class primary purpose is to provide easy access to game objects like creeps and rooms.
 */
class Empire {
     /**
     * Initializes a new instance of the Empire class.
     */
    constructor() {
        this._mem = Memory.empire;

        // Saving creeps to memory every tick to make the population visible.
        // This is temporary. Should instead have a command to output creeps.
        this._mem.creeps = {};

        this._creepFactory = new CreepFactory();

        this._rooms = {};
        this._allRooms = [];

        this._creeps = {};
        this._allCreeps = [];
    }

    /**
     * Get an array of all known rooms.
     */
    get rooms() {
        return this._allRooms;
    }

    /**
     * Get an array of all living creeps.
     */
    get creeps() {
        return this._allCreeps;
    }

    /**
     * Get a room by its name.
     * 
     * @param {string} roomName - The name of the room to retrieve.
     */
    getRoom(roomName) {
        if (this._rooms[roomName]) {
            return this._rooms[roomName];
        }
        return new RoomBase(roomName);
    }

    /**
     * Get an object with all creeps assigned to be working in the specified room.
     * 
     * @param {string} roomName - The name of the room to retrieve.
     */
    getCreeps(roomName) {
        if (this._creeps[roomName]) {
            return this._creeps[roomName];
        }
        return {};
    }

    /**
     * Attempt to reserve a game object or something with a unique id to prevent other
     * creeps, towers, etc from targeting the same thing. A reservation will time out and 
     * be released after 2 ticks. This means a reservation must be renewed.
     * 
     * @param {string} id - A unique id identifying what is being reserved.
     * @param {string} creepName - The name of the creep making the reservation.
     */
    reserve(id, creepName) {
        if (!this._mem.reservations[id]) {
            this._mem.reservations[id] = { creepName: creepName, ttl: 2 };
            return true;
        }
        if (this._mem.reservations[id].creepName === creepName) {
            this._mem.reservations[id].ttl = 2;
            return true;
        }
        return false;
    }

    /**
     * This method is responsible for arranging all important game objects in easy to access collections.
     */
    prepare() {
        for (let roomName in Game.rooms) {
            this._rooms[roomName] = new RoomReal(Game.rooms[roomName]);
            this._allRooms.push(this._rooms[roomName]);
        }

        for (let roomName in Memory.rooms) {
            if (!this._rooms[roomName]) {
                this._allRooms.push(new RoomBase(roomName));
            }
        }

        // Loop through all creeps in memory and sort them to quick access buckets.
        for (let creepName in Memory.creeps) {
            let creep = Game.creeps[creepName];
            if (!creep) {
                // The creep must have died.
                delete Memory.creeps[creepName];
                continue;
            }

            let smartCreep = this._creepFactory.wrap(creep);
            this._allCreeps.push(smartCreep);

            smartCreep.Room = this.getRoom(creep.room.name);
            smartCreep.HomeRoom = this.getRoom(creep.memory.rooms.home);
            smartCreep.WorkRoom = this.getRoom(creep.memory.rooms.work);

            if (smartCreep.IsRetired) {
                // Don't count creeps that are retired.
                continue;
            }

            let job = smartCreep.job;
            let workroom = smartCreep.WorkRoom.name;

            if (!this._mem.creeps[workroom]) {
                this._mem.creeps[workroom] = {};
            }
            if (!this._mem.creeps[workroom][job + 's']) {
                this._mem.creeps[workroom][job + 's'] = [];
            }
            this._mem.creeps[workroom][job + 's'].push(creepName);

            if (!this._creeps[workroom]) {
                this._creeps[workroom] = {};
            }

            if (!this._creeps[workroom][job + 's']) {
                this._creeps[workroom][job + 's'] = [];
            }
            this._creeps[workroom][job + 's'].push(smartCreep);
        }
    }

    createCreep(job, task, spawnName, bodyCode, homeRoom, workRoom) {
        if (!Game.spawns[spawnName]) {
            console.log("Error: No spawn with the name '" + spawnName + "'.")
            return ERR_BUSY;
        }

        let body = this._creepFactory.buildBody(bodyCode);
        let memory = {
            "job": {
                "name": job,
                "task": task
            },
            "rooms": {
                "home": homeRoom,
                "work": workRoom
            }
        }

        return Game.spawns[spawnName].createCreep(body, null, memory);
    }

    print(input, log = true) {
        if (_.isObject(input)) {
            input = JSON.stringify(input);
        }

        input = "<font style='color:#e6de99'>" + input + "</font>";

        if (!log) {
            console.log(input);
            return;
        }

        return input;
    }
}

module.exports = Empire;
