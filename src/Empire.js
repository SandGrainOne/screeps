'use strict';

let CreepMaker = require('./CreepMaker');

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

        this._roomsOwned = [];
        this._roomsToBeAnalyzed = [];
    }

    /**
     * Get a Map with all known rooms.
     */
    get rooms () {
        return this._rooms;
    }

    /**
     * Get a Map with all known rooms.
     */
    get roomsOwned () {
        return this._roomsOwned;
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

            if (room.isMine) {
                this._roomsOwned.push(room.name);
            }

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

            if (smartCreep.isRetired) {
                // Don't count creeps that are retired. They should be replaced.
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

                if (room.isVisible && room.isMine && !_.isNull(room.observer)) {
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
            // os.log.info(richest.name + '.terminal.store.energy: ' + richest.terminal.store.energy);
            // os.log.info(poorest.name + '.terminal.storeCapacity - _.sum(' + poorest.name + '.terminal.store): ' + (poorest.terminal.storeCapacity - _.sum(poorest.terminal.store)));
            if (richest.terminal.store.energy > 30000 && poorest.terminal.store.energy < 100000 && poorest.terminal.storeCapacity - _.sum(poorest.terminal.store) > 20000) {
                os.log.info('Transfering 10000 energy from ' + richest.name + '(' + richestAmount + ') to ' + poorest.name + '(' + poorestAmount + ')');
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

    createCreep (job, bodyCode, homeRoom, workRoom) {
        let spawn = this.findSpawn(homeRoom);

        if (_.isNull(spawn)) {
            return ERR_BUSY;
        }

        return CreepMaker.createCreep(job, spawn.name, bodyCode, homeRoom, workRoom);
    }

    findSpawn (roomName) {
        let room = this.getRoom(roomName);
        if (room.isVisible) {
            if (room.isMine) {
                for (const spawn of room.spawns) {
                    if (!spawn.spawning) {
                        return spawn;
                    }
                }
            }
        }
        return null;
    }

    checkRoomMemory () {
        for (let room of this.rooms.values()) {
            if (!_.isUndefined(room._mem.neighbours)) {
                os.log.info('Room: ' + room.name);
                delete room._mem.neighbours;
                return;
            }
        }
        os.log.info('Found no issues');
    }
}

module.exports = Empire;
