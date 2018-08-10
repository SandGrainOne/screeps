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
     * @param {string} type - Type of reservation describe different reasons for reserving a target.
     * @param {string} creepName - The name of the creep making the reservation.
     */
    reserve(id, type, creepName) {
        let key = type + "_" + id;
        if (!this._mem.reservations[key]) {
            this._mem.reservations[key] = { creepName: creepName, ttl: 2 };
            return true;
        }
        if (this._mem.reservations[key].creepName === creepName) {
            this._mem.reservations[key].ttl = 2;
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

            if (smartCreep.isRetired) {
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

    balanceEnergy(){
        // Run this only every 10th tick.
        if (Game.time % 10 !== 0) {
            return;
        }

        let poorest = null;
        let poorestAmount = 3000000;
        let richest = null;
        let richestAmount = 0;

        for (let room of this.rooms) {
            if (!room.isVisible || !room.isMine || !room.storage || !room.terminal) {
                // Room can not take part in the energy balancing game.
                continue;
            }

            let roomEnergy = room.storage.store.energy + room.terminal.store.energy;

            if (poorest === null || roomEnergy < poorestAmount) {
                poorestAmount = roomEnergy;
                poorest = room;
            }

            if (richest === null || roomEnergy > richestAmount) {
                richestAmount = roomEnergy;
                richest = room;
            }
        }

        if (richestAmount - poorestAmount > 100000) {
            //this.print(richest.name + ".terminal.store.energy: " + richest.terminal.store.energy);
            //this.print(poorest.name + ".terminal.storeCapacity - _.sum(" + poorest.name + ".terminal.store): " + (poorest.terminal.storeCapacity - _.sum(poorest.terminal.store)));
            if (richest.terminal.store.energy > 20000 && poorest.terminal.storeCapacity - _.sum(poorest.terminal.store) > 40000) {
                this.print("Transfering 10000 energy from " + richest.name + "(" + richestAmount + ") to " + poorest.name + "(" + poorestAmount + ")");
                richest.terminal.send(RESOURCE_ENERGY, 10000, poorest.name);
            }
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
            },
            "spawnTime": body.length * 3
        }

        return Game.spawns[spawnName].createCreep(body, null, memory);
    }

    print(input) {
        if (_.isObject(input)) {
            input = JSON.stringify(input);
        }

        input = "<font style='color:#999999'>" + input + "</font>"; // e6de99 - "yellow"

        console.log(input);

        return;
    }
}

module.exports = Empire;
