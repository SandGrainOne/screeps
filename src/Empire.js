'use strict';

let CreepMaker = require('./CreepMaker');
let SquadMaker = require('./SquadMaker');

let RoomBase = require('./Room.Base');
let RoomReal = require('./Room.Real');

/**
 * The Empire class primary purpose is to provide easy access to game objects like creeps and rooms.
 */
class Empire {
    /**
     * Initializes a new instance of the Empire class.
     */
    constructor () {
        this._mem = Memory.empire;

        // Saving creeps to memory every tick to make the population visible.
        // This is temporary. Should instead have a command to output creeps.
        this._mem.creeps = {};

        this._rooms = new Map();

        this._creeps = {};
        this._creeps.all = {};

        this._roomsToBeAnalyzed = [];

        this._squads = new Map();
    }

    /**
     * Get a Map with all known rooms.
     */
    get rooms () {
        return this._rooms;
    }

    /**
     * Get an iterable collection of squads.
     */
    get squads () {
        return this._squads.values();
    }

    /**
     * Get an array of all living creeps.
     */
    get creeps () {
        return this._creeps;
    }

    /**
     * Get a specific room.
     */
    getRoom (name) {
        if (this.rooms.has(name)) {
            return this.rooms.get(name);
        }
        return new RoomBase(name);
    }

    /**
     * This method is responsible for arranging all important game objects in easy to access collections.
     */
    prepare () {
        for (let roomName in Game.rooms) {
            let room = new RoomReal(Game.rooms[roomName]);

            this.rooms.set(roomName, room);

            if (Game.time - room.tickAnalyzed > 20) {
                if (this._roomsToBeAnalyzed.length > 0) {
                    if (room.tickAnalyzed < _.last(this._roomsToBeAnalyzed).tickAnalyzed) {
                        this._roomsToBeAnalyzed.push(room);
                    }
                }
                else {
                    this._roomsToBeAnalyzed.push(room);
                }
            }
        }

        for (let roomName in Memory.rooms) {
            if (!this.rooms.has(roomName)) {
                this.rooms.set(roomName, new RoomBase(roomName));
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

            let smartCreep = CreepMaker.wrap(creep);
            this._creeps.all[smartCreep.name] = smartCreep;

            // TODO: Remove these. The creeps should do this themselves.
            smartCreep.WorkRoom = this.rooms.get(creep.memory.rooms.work);

            if (smartCreep.isRetired) {
                // Don't count creeps that are retired.
                continue;
            }

            let job = smartCreep.job;
            let workroom = creep.memory.rooms.work;

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

    observe (roomName, ticks) {
        if (_.isUndefined(this._mem.observations)) {
            this._mem.observations = {};
        }
        this._mem.observations[roomName] = ticks;
    }

    tickObservations () {
        if (_.isUndefined(this._mem.observations)) {
            return;
        }

        let index = 0;
        let roomNames = Array.from(this.rooms.keys());

        for (let roomToObserve in this._mem.observations) {
            while (index < roomNames.length) {
                let room = this.rooms.get(roomNames[index]);
                index = index + 1;

                if (room.isMine && room.isVisible && !_.isNull(room.observer)) {
                    if (room.observer.observeRoom(roomToObserve) === OK) {
                        break;
                    }
                }
            }

            this._mem.observations[roomToObserve] = this._mem.observations[roomToObserve] - 1;
            if (this._mem.observations[roomToObserve] === 0) {
                delete this._mem.observations[roomToObserve];
            }
        }
    }

    balanceEnergy () {
        // Run this only every 10th tick.
        if (Game.time % 10 !== 0) {
            return;
        }

        let poorest = null;
        let poorestAmount = 3000000;
        let richest = null;
        let richestAmount = 0;

        for (let room of this.rooms.values()) {
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
            // this.print(richest.name + '.terminal.store.energy: ' + richest.terminal.store.energy);
            // this.print(poorest.name + '.terminal.storeCapacity - _.sum(' + poorest.name + '.terminal.store): ' + (poorest.terminal.storeCapacity - _.sum(poorest.terminal.store)));
            if (richest.terminal.store.energy > 30000 && poorest.terminal.store.energy < 100000 && poorest.terminal.storeCapacity - _.sum(poorest.terminal.store) > 20000) {
                this.print('Transfering 10000 energy from ' + richest.name + '(' + richestAmount + ') to ' + poorest.name + '(' + poorestAmount + ')');
                richest.terminal.send(RESOURCE_ENERGY, 10000, poorest.name);
            }
        }
    }

    /**
     * Analyze the next set of rooms.
     */
    analyzeRooms () {
        if (_.isUndefined(this._roomsToBeAnalyzed) || this._roomsToBeAnalyzed.length <= 0) {
            return;
        }

        let count = Math.min(this._roomsToBeAnalyzed.length, 2);
        do {
            count--;
            let room = this._roomsToBeAnalyzed.pop();
            room.analyze();
        } while (count > 0);
    }

    createCreep (job, task, spawnName, bodyCode, homeRoom, workRoom) {
        return CreepMaker.createCreep(job, task, spawnName, bodyCode, homeRoom, workRoom);
    }

    print (input) {
        if (_.isObject(input)) {
            input = JSON.stringify(input);
        }

        input = '<font style="color:#999999">' + input + '</font>'; // e6de99 - "yellow"

        console.log(input);
    }

    checkRoomMemory () {
        for (let room of this.rooms.values()) {
            if (!_.isUndefined(room._mem.resources)) {
                console.log('Room: ' + room.name);
                return;
            }
        }

        console.log('Found no issues');
    }

    findSpawn (roomName) {
        for (let spawnName in Game.spawns) {
            let spawn = Game.spawns[spawnName];

            let distance = 0;
            if (spawn.room.name !== roomName) {
                distance = Game.map.getRoomLinearDistance(spawn.room.name, roomName);
                if (distance < 5) {
                    distance = Game.map.findRoute(spawn.room.name, roomName).length;
                }
            }

            console.log('Distance from ' + spawnName + ' to ' + roomName + ': ' + distance);
        }
    }

    createId () {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });

        return uuid;
    }
}

module.exports = Empire;
