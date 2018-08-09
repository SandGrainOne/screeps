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
        Memory.empire = {};
        Memory.empire.creeps = {};

        this._mem = Memory.empire;

        this._creepFactory = new CreepFactory();

        this._rooms = {};
        this._allRooms = [];

        this._creeps = {};
        this._allCreeps = [];
    }

    /**
     * Get an array of all known rooms.
     */
    get AllRooms() {
        return this._allRooms;
    }

    /**
     * Get an array of all living creeps.
     */
    get AllCreeps() {
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
     * Get an object with all creeps working in the specified room.
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

            let job = creep.memory.job;
            if (job.name) {
                job = job.name;
            }

            let workroom = creep.memory.rooms.work;
            if (!this._mem.creeps[workroom]) {
                this._mem.creeps[workroom] = {};
            }
            if (!this._mem.creeps[workroom][job + 's']) {
                this._mem.creeps[workroom][job + 's'] = [];
            }
            this._mem.creeps[workroom][job + 's'].push(creepName);

            let smartCreep = this._creepFactory.wrap(creep);
            this._allCreeps.push(smartCreep);

            if (!this._creeps[workroom]) {
                this._creeps[workroom] = {};
            }

            if (!this._creeps[workroom][job + 's']) {
                this._creeps[workroom][job + 's'] = [];
            }
            this._creeps[workroom][job + 's'].push(smartCreep);

            smartCreep.Room = this.getRoom(creep.room.name);
            smartCreep.HomeRoom = this.getRoom(creep.memory.rooms.home);
            smartCreep.WorkRoom = this.getRoom(creep.memory.rooms.work);
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
