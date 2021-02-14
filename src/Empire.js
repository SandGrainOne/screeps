'use strict';

const CreepMaker = require('./CreepMaker');

const RoomBase = require('./Room.Base');
const RoomReal = require('./Room.Real');

/**
 * The Empire class primary purpose is to provide easy access to game objects like creeps and rooms.
 */
class Empire {
    /**
     * Initializes a new instance of the Empire class.
     */
    constructor () {
        this._mem = Memory.empire;

        this._rooms = new Map();

        this._creeps = {};
        this._creeps.all = {};

        this._roomsOwned = [];
        this._roomsToBeAnalyzed = [];

        this._spawnQueue = [];
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

    orderCreep (jobName, bodyCode, homeRoom, workRoom) {
        const body = CreepMaker.buildBody(bodyCode);

        const job = {
            'priority': 1,
            'jobName': jobName,
            'body': body,
            'homeRoom': homeRoom,
            'workRoom': workRoom
        };

        if (this._mem.creepOrderQueue === undefined) {
            this._mem.creepOrderQueue = [];
        }

        this._mem.creepOrderQueue.push(job);

        return 'Added order for a ' + jobName + ' in ' + homeRoom + ' to the queue.';
    }

    queueCreepSpawn (spawningRule) {
        if (spawningRule === null) {
            return;
        }

        this._spawnQueue.push(spawningRule);
    }

    performSpawning () {
        if (this._mem.creepOrderQueue !== undefined) {
            this._spawnQueue = this._spawnQueue.concat(this._mem.creepOrderQueue);
            delete this._mem.creepOrderQueue;
        }

        if (this._spawnQueue.length === 0) {
            return;
        }

        if (this._spawnQueue.length > 1) {
            this._spawnQueue.sort((a, b) => a.priority - b.priority);
        }

        const roomLocks = {};
        for (let i = 0; i < this._spawnQueue.length; i++) {
            const job = this._spawnQueue[i];

            // Spawn only one creep in each room. 
            if (roomLocks[job.homeRoom]) {
                continue;
            }
            roomLocks[job.homeRoom] = true;

            const foundSpawn = this.findSpawn(job);
            if (foundSpawn !== null) {
                CreepMaker.spawnCreep(foundSpawn, job);
            }
        }
    }

    findSpawn (job) {
        const cost = CreepMaker.getCost(job.body);
        const room = this.getRoom(job.homeRoom);

        let tta = Infinity;
        let foundSpawn = null;
        if (room.isMine) {
            if (cost <= room.energyCapacityAvailable) {
                if (cost <= room.energyAvailable) {
                    for (let j = 0; j < room.spawns.length; j++) {
                        if (room.spawns[j].spawning === null) {
                            foundSpawn = room.spawns[j];
                            tta = 0;
                            break;
                        }

                        if (tta > room.spawns[j].spawning.remainingTime) {
                            foundSpawn = room.spawns[j];
                            tta = room.spawns[j].spawning.remainingTime;
                        }
                    }
                }
            }
            else {
                os.logger.error('Creep body too expensive for home room: ' + job.jobName + ' , ' + job.homeRoom);
            }
        }
        else {
            os.logger.error('Invalid home room for creep: ' + job.jobName + ' , ' + job.homeRoom);
        }

        return tta === 0 ? foundSpawn : null;
    }

    /**
     * This method is responsible for arranging all important game objects in easy to access collections.
     */
    prepare () {
        for (const roomName in Game.rooms) {
            const room = new RoomReal(Game.rooms[roomName]);

            this.rooms.set(roomName, room);

            if (room.isMine) {
                this._roomsOwned.push(room.name);
            }

            if (Game.time - room.tickAnalyzed > 20) {
                if (this._roomsToBeAnalyzed.length > 0) {
                    if (room.tickAnalyzed < this._roomsToBeAnalyzed[this._roomsToBeAnalyzed.length - 1].tickAnalyzed) {
                        this._roomsToBeAnalyzed.push(room);
                    }
                }
                else {
                    this._roomsToBeAnalyzed.push(room);
                }
            }
        }

        for (const roomName in Memory.rooms) {
            if (!this.rooms.has(roomName)) {
                this.rooms.set(roomName, new RoomBase(roomName));
            }
        }

        // Loop through all creeps in memory and sort them to quick access buckets.
        for (const creepName in Memory.creeps) {
            const creep = Game.creeps[creepName];

            if (creep === undefined) {
                // The creep must have died.
                delete Memory.creeps[creepName];
                continue;
            }

            const smartCreep = CreepMaker.wrap(creep);
            this._creeps.all[smartCreep.name] = smartCreep;

            if (smartCreep.isRetired) {
                // Don't count creeps that are retired. They should be replaced.
                continue;
            }

            const job = smartCreep.job;
            const workroom = creep.memory.rooms.work;

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
        if (this._mem.observations === undefined) {
            this._mem.observations = {};
        }
        this._mem.observations[roomName] = ticks;
    }

    tickObservations () {
        if (this._mem.observations === undefined) {
            return;
        }

        let index = 0;

        for (const roomToObserve in this._mem.observations) {
            while (index < this.roomsOwned.length) {
                const room = this.roomsOwned[index];
                index = index + 1;

                if (room.observer !== null) {
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

        for (const room of this.rooms.values()) {
            if (!room.isVisible || !room.isMine || !room.storage || !room.terminal) {
                // Room can not take part in the energy balancing game.
                continue;
            }

            const roomEnergy = room.storage.store.energy + room.terminal.store.energy;

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
            // os.logger.info('Richest: ' + richest.name + ' Total energy: ' + richestAmount + ' Terminal energy: ' + richest.terminal.store.energy + ' Required: 30000');
            // os.logger.info('Poorest: ' + poorest.name + ' Total energy: ' + poorestAmount + ' Terminal space : ' + (poorest.terminal.store.getCapacity() - poorest.terminal.store.getUsedCapacity()) + ' Required: 20000');
            if (richest.terminal.store.energy > 30000 && poorest.terminal.store.energy < 100000 && poorest.terminal.store.getCapacity() - poorest.terminal.store.getUsedCapacity() > 20000) {
                os.logger.info('Transfering 10000 energy from ' + richest.name + '(' + richestAmount + ') to ' + poorest.name + '(' + poorestAmount + ')');
                richest.terminal.send(RESOURCE_ENERGY, 10000, poorest.name);
            }
        }
    }

    /**
     * Analyze the next set of rooms.
     */
    analyzeRooms () {
        if (this._roomsToBeAnalyzed === undefined || this._roomsToBeAnalyzed.length <= 0) {
            return;
        }

        let count = Math.min(this._roomsToBeAnalyzed.length, 3);
        do {
            count--;
            const room = this._roomsToBeAnalyzed.pop();
            room.analyze();
        } while (count > 0);
    }

    checkRoomMemory () {
        for (const room of this.rooms.values()) {
            if (room._mem.neighbours === null) {
                os.logger.info('Room: ' + room.name);
                delete room._mem.neighbours;
                return;
            }
        }
        os.logger.info('Found no issues');
    }
}

module.exports = Empire;
