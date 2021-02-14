'use strict';

const C = require('./constants');

const RoomBase = require('./Room.Base');

const Links = require('./Links');
const Labs = require('./Labs');

/**
 * Wrapper class with logic for visible rooms.
 */
class RoomReal extends RoomBase {
    /**
     * Initializes a new instance of the RoomBase class with the specified room.
     * 
     * @param {Room} room - The room to be wrapped.
     */
    constructor (room) {
        super(room.name);

        this._room = room;
        this._mem = room.memory;
        this._visible = true;

        this._spawn = {};
        this._spawn.high = [];
        this._spawn.normal = [];
    }

    /**
     * Gets the tick number where the room was analyzed.
     */
    get tickAnalyzed () {
        return this._mem.tickAnalyzed === undefined ? 0 : this._mem.tickAnalyzed;
    }

    /**
     * Sets the tick number where the room was analyzed.
     */
    set tickAnalyzed (value) {
        this._mem.tickAnalyzed = value;
    }

    /**
     * Gets the room controller if it exists.
     */
    get controller () {
        if (this._room.controller === undefined) {
            return null;
        }
        return this._room.controller;
    }

    /**
     * Gets a value indicating whether the room is owned by current user.
     */
    get isMine () {
        return this.controller !== null && this.controller.my;
    }

    /**
     * Gets the room storage if it exists.
     */
    get storage () {
        if (this._room.storage === undefined) {
            return null;
        }
        return this._room.storage;
    }

    /**
     * Gets the room terminal if it exists.
     */
    get terminal () {
        if (this._room.terminal === undefined) {
            return null;
        }
        return this._room.terminal;
    }

    /**
     * Gets an array with all sources in the room.
     */
    get sources () {
        if (this._cache.sources !== undefined) {
            return this._cache.sources;
        }
        this._cache.sources = this._room.find(FIND_SOURCES);
        return this._cache.sources;
    }

    /**
     * Gets the room mineral node if it exists.
     */
    get minerals () {
        if (this._cache.minerals !== undefined) {
            return this._cache.minerals;
        }
        const minerals = this._room.find(FIND_MINERALS);
        this._cache.minerals = minerals.length > 0 ? minerals[0] : null;
        return this._cache.minerals;
    }

    /**
     * Gets an array with tombstones holding resources.
     */
    get tombstones () {
        if (this._cache.tombstones !== undefined) {
            return this._cache.tombstones;
        }
        this._cache.tombstones = this._room.find(FIND_TOMBSTONES, {
            filter: (t) => t.store.getUsedCapacity() > 0
        });
        return this._cache.tombstones;
    }

    /**
     * Gets an array with all drops in the room.
     */
    get drops () {
        if (this._cache.drops !== undefined) {
            return this._cache.drops;
        }
        // TODO: Sort or prioritise the drops in some way?
        this._cache.drops = this._room.find(FIND_DROPPED_RESOURCES);
        return this._cache.drops;
    }

    /**
     * Gets an array with all containers in the room. Empty if there are no containers.
     * The array is sorted decending based the amount stored. Used by haulers to prioritise
     * containers with the most resources.
     */
    get containers () {
        if (this._cache.containers !== undefined) {
            return this._cache.containers;
        }
        this._cache.containers = this.recall(STRUCTURE_CONTAINER);
        if (this._cache.containers.length > 1) {
            this._cache.containers.sort((a, b) => b.store.getUsedCapacity() - a.store.getUsedCapacity());
        }
        return this._cache.containers;
    }

    /**
     * Gets the room extractor if it exists. Otherwise null.
     */
    get extractor () {
        if (this._cache.extractor !== undefined) {
            return this._cache.extractor;
        }
        const extractors = this.recall(STRUCTURE_EXTRACTOR);
        this._cache.extractor = extractors.length > 0 ? extractors[0] : null;
        return this._cache.extractor;
    }

    /**
     * Gets the room factory if it exists.
     * 
     * @returns {StructurePowerSpawn} The factory of the room or null.
     */
    get factory () {
        if (this._cache.factory !== undefined) {
            return this._cache.factory;
        }
        const factories = this.recall(STRUCTURE_FACTORY);
        this._cache.factory = factories.length > 0 ? factories[0] : null;
        return this._cache.factory;
    }

    /**
     * Gets the linking system in the room and easy access to individual links.
     */
    get links () {
        if (this._cache.links !== undefined) {
            return this._cache.links;
        }
        // Ensure that the linking system has some memory reserved from the room
        if (this._mem.links === undefined) {
            this._mem.links = {};
        }
        this._cache.links = new Links(this._mem.links);
        return this._cache.links;
    }

    /**
     * Gets the laboratory unit in the room and easy access to individual labs.
     */
    get labs () {
        if (this._cache.labs !== undefined) {
            return this._cache.labs;
        }
        // Ensure that the laboratory unit has some memory reserved from the room.
        if (this._mem.labs === undefined) {
            this._mem.labs = {};
        }
        this._cache.labs = new Labs(this._mem.labs);
        return this._cache.labs;
    }

    /**
     * Gets an array with all towers in the room. Empty if there are no towers.
     * The array is sorted ascending based the amount of energy stored. Used by 
     * refuelers to prioritise towers with the least resources.
     */
    get towers () {
        if (this._cache.towers !== undefined) {
            return this._cache.towers;
        }
        this._cache.towers = this.recall(STRUCTURE_TOWER);
        if (this._cache.towers.length > 1) {
            this._cache.towers.sort((a, b) => a.energy - b.energy);
        }
        return this._cache.towers;
    }

    /**
     * Gets an array with all walls in the room. Empty if there are no walls.
     * 
     * @returns {StructureWall[]} All walls in the room.
     */
    get walls () {
        if (this._cache.walls !== undefined) {
            return this._cache.walls;
        }
        this._cache.walls = this._room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_WALL
        });
        return this._cache.walls;
    }

    /**
     * Gets an array with all ramparts in the room. Empty if there are no ramparts.
     * 
     * @returns {StructureRampart[]} All ramparts in the room.
     */
    get ramparts () {
        if (this._cache.ramparts !== undefined) {
            return this._cache.ramparts;
        }
        this._cache.ramparts = this._room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_RAMPART
        });
        return this._cache.ramparts;
    }

    /**
     * Gets an array with all construction sites in the room. Empty if there
     * are no construction sites.
     */
    get constructionSites () {
        if (this._cache.constructionSites !== undefined) {
            return this._cache.constructionSites;
        }
        this._cache.constructionSites = this._room.find(FIND_CONSTRUCTION_SITES);
        return this._cache.constructionSites;
    }

    /**
     * Gets an array with all spawns in the room. Empty if there are no spawns.
     * 
     * @returns {StructureSpawn[]} All spawns in the room.
     */
    get spawns () {
        if (this._cache.spawns !== undefined) {
            return this._cache.spawns;
        }
        this._cache.spawns = this.recall(STRUCTURE_SPAWN);
        return this._cache.spawns;
    }

    /**
     * Gets an array with all extensions in the room. Empty if there are no extensions.
     * 
     * @returns {StructureExtension[]} All extensions in the room.
     */
    get extensions () {
        if (this._cache.extensions !== undefined) {
            return this._cache.extensions;
        }
        this._cache.extensions = this._room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_EXTENSION
        });
        return this._cache.extensions;
    }

    /**
     * Gets the nuker structure in the room is it exists. Otherwise null.
     */
    get nuker () {
        if (this._cache.nuker !== undefined) {
            return this._cache.nuker;
        }
        const nukers = this.recall(STRUCTURE_NUKER);
        this._cache.nuker = nukers.length > 0 ? nukers[0] : null;
        return this._cache.nuker;
    }

    /**
     * Gets the room observer if it exists.
     */
    get observer () {
        if (this._cache.observer !== undefined) {
            return this._cache.observer;
        }
        const observers = this.recall(STRUCTURE_OBSERVER);
        this._cache.observer = observers.length > 0 ? observers[0] : null;
        return this._cache.observer;
    }

    /**
     * Gets the room power spawn if it exists.
     * 
     * @returns {StructurePowerSpawn} The power spawn of the room or null.
     */
    get powerSpawn () {
        if (this._cache.powerSpawn !== undefined) {
            return this._cache.powerSpawn;
        }
        const powerSpawns = this.recall(STRUCTURE_POWER_SPAWN);
        this._cache.powerSpawn = powerSpawns.length > 0 ? powerSpawns[0] : null;
        return this._cache.powerSpawn;
    }

    /**
     * Gets an array with all keeper lairs in the room. Empty if there are no keeper lairs.
     */
    get keeperLairs () {
        if (this._cache.keeperLairs !== undefined) {
            return this._cache.keeperLairs;
        }
        this._cache.keeperLairs = this.recall(STRUCTURE_KEEPER_LAIR);
        if (this._cache.keeperLairs.length > 1) {
            this._cache.keeperLairs.sort((a, b) => a.ticksToSpawn - b.ticksToSpawn);
        }
        return this._cache.keeperLairs;
    }

    /**
     * Gets an array of structures that need repairs. Empty if there are no such structures.
     */
    get repairs () {
        if (this._cache.repairs !== undefined) {
            return this._cache.repairs;
        }
        this._cache.repairs = [];
        for (const structure of this.recall('repair')) {
            if (structure.hits < structure.hitsMax) {
                this._cache.repairs.push(structure);
            }
            if (this._cache.repairs.length > 5) {
                break;
            }
        }
        return this._cache.repairs;
    }

    /**
     * Gets an object with all flags in the room grouped by the primary color.
     */
    get flags () {
        if (this._cache.flags !== undefined) {
            return this._cache.flags;
        }
        const flagsArray = this._room.find(FIND_FLAGS);
        if (flagsArray.length > 0) {
            this._cache.flags = this.groupBy(flagsArray, 'color');
        }
        else {
            this._cache.flags = {};
        }
        return this._cache.flags;
    }

    /**
     * Gets the amount of energy currently available in the room.
     */
    get energyAvailable () {
        return this._room.energyAvailable;
    }

    /**
     * Gets the total energy capacity of all spawns and extensions in the room.
     */
    get energyCapacityAvailable () {
        return this._room.energyCapacityAvailable;
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
    reserve (id, type, creepName) {
        if (this._mem.reservations === undefined) {
            this._mem.reservations = {};
        }

        const key = type + '_' + id;
        if (this._mem.reservations[key] === undefined) {
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
     * Perform all room specific logic.
     */
    run () {
        // Prepare the room for the current tick.
        this.prepare();

        // Let the towers do their thing
        this.defend();

        this.processPower();

        // Run linking logic so that energy is teleported to the storage and controller.
        this.links.run();

        // Run reactions on all labs in the room.
        this.labs.run();

        // Increase the TTL of all reservations and remove those that expired.
        this.tickReservations();
    }

    /**
     * Perform an analysis of the room.
     */
    analyze () {
        // Forget all stored ids before refilling the data structure.
        this._mem.ids = {};

        const labs = [];
        const links = [];

        this.clearFlags();

        for (const structure of this._room.find(FIND_STRUCTURES)) {
            switch (structure.structureType) {
                case STRUCTURE_CONTAINER:
                    this.remember(structure.id, STRUCTURE_CONTAINER);
                    break;
                case STRUCTURE_EXTRACTOR:
                    this.remember(structure.id, STRUCTURE_EXTRACTOR);
                    break;
                case STRUCTURE_KEEPER_LAIR:
                    this.remember(structure.id, STRUCTURE_KEEPER_LAIR);
                    break;
                case STRUCTURE_TOWER:
                    this.remember(structure.id, STRUCTURE_TOWER);
                    break;
                case STRUCTURE_NUKER:
                    this.remember(structure.id, STRUCTURE_NUKER);
                    break;
                case STRUCTURE_SPAWN:
                    this.remember(structure.id, STRUCTURE_SPAWN);
                    break;
                case STRUCTURE_OBSERVER:
                    this.remember(structure.id, STRUCTURE_OBSERVER);
                    break;
                case STRUCTURE_POWER_SPAWN:
                    this.remember(structure.id, STRUCTURE_POWER_SPAWN);
                    break;
                case STRUCTURE_FACTORY:
                    this.remember(structure.id, STRUCTURE_FACTORY);
                    break;
                case STRUCTURE_LINK:
                    links.push(structure);
                    break;
                case STRUCTURE_LAB:
                    labs.push(structure);
                    break;
            }

            this.checkRepairs(structure);
        }

        this.links.populate(this, links);
        this.labs.populate(this, labs);

        if (this._mem.tickClaimed === undefined && this.isMine) {
            this._mem.tickClaimed = Game.time;
        }
        if (this._mem.tickClaimed !== undefined && !this.isMine) {
            delete this._mem.tickClaimed;
        }

        const roomDistances = [];

        for (const roomName of Empire.roomsOwned) {
            if (this.name === roomName) {
                // Don't count self
                continue;
            }

            let distance = Game.map.getRoomLinearDistance(this.name, roomName);
            if (distance < 5) {
                distance = Game.map.findRoute(this.name, roomName).length;
            }
            const roomDistance = {
                name: roomName,
                distance: distance
            };
            roomDistances.push(roomDistance);
        }

        roomDistances.sort((a, b) => a.distance - b.distance);
        this._mem.ownedRooms = roomDistances;

        this.tickAnalyzed = Game.time;
    }

    checkRepairs (structure) {
        const greyFlags = this.flags[COLOR_GREY];

        if (greyFlags !== undefined) {
            for (const greyFlag of greyFlags) {
                if (structure.pos.isEqualTo(greyFlag)) {
                    return;
                }
            }
        }

        const wallSize = 3600000;
        let hitsMax = 0;

        switch (structure.structureType) {
            case STRUCTURE_WALL:
                if (this.isMine) {
                    hitsMax = wallSize;
                }
                break;
            case STRUCTURE_RAMPART:
                if (structure.my) {
                    hitsMax = wallSize;
                }
                break;
            case STRUCTURE_ROAD:
                // Allow roads to decay a little bit. This is so that builders would need to spend a
                // little bit more time and energy repairing before moving on. This to reduce travel time.
                hitsMax = structure.hitsMax - 1000;
                break;
            case STRUCTURE_CONTAINER:
                hitsMax = structure.hitsMax;
                break;
            default:
                if (structure.my) {
                    hitsMax = structure.hitsMax;
                }
                break;
        }

        if (structure.hits < hitsMax) {
            this.remember(structure.id, 'repair');
        }
    }

    clearFlags () {
        const greyFlags = this.flags[COLOR_GREY];

        if (greyFlags !== undefined) {
            for (const greyFlag of greyFlags) {
                const foundStructures = greyFlag.pos.lookFor(LOOK_STRUCTURES);
                if (foundStructures.length === 0) {
                    greyFlag.remove();
                }
            }
        }
    }

    /**
     * Create a list of jobs that needs to be occupied by creeps.
     */
    createJobs () {
        this._mem.jobs.miners = 0;
        if (this.isMine && this.storage !== null) {
            if (this.storage.store.getUsedCapacity() < this.storage.store.getCapacity() * 0.9) {
                this._mem.jobs.miners = this.sources.length;
            }
        }
        else {
            this._mem.jobs.miners = this.sources.length;
        }

        this._mem.jobs.mineralminers = 0;
        if (this.isMine && this.terminal !== null) {
            if (this.terminal.store.getUsedCapacity() < this.terminal.store.getCapacity() * 0.5) {
                if (this.minerals !== null && this.minerals.mineralAmount > 0 && this.extractor !== null) {
                    this._mem.jobs.mineralminers = 1;
                }
            }
        }
        else {
            if (this.minerals !== null && this.minerals.mineralAmount > 0 && this.extractor !== null) {
                this._mem.jobs.mineralminers = 1;
            }
        }

        this._mem.jobs.haulers = this.containers.length + this._room.terminal !== null ? 1 : 0;

        this._mem.jobs.refuelers = 0;
        if (this.storage && this.storage.store[RESOURCE_ENERGY] > 10000) {
            this._mem.jobs.refuelers = 2;
        }

        this._mem.jobs.linkers = 0;
        if (this.storage !== null && this.links.storage !== null) {
            this._mem.jobs.linkers = 1;
        }

        this._mem.jobs.settlers = 0;
        if (this.controller !== null && this.controller.owner === undefined) {
            if (this.controller.reservation !== undefined) {
                if (this.controller.reservation.username === C.USERNAME && this.controller.reservation.ticksToEnd < 4000) {
                    this._mem.jobs.settlers = 1;
                }
            }
            else {
                this._mem.jobs.settlers = 1;
            }
        }

        this._mem.jobs.dismantlers = 0;
        if (this.flags[COLOR_GREY] !== undefined) {
            this._mem.jobs.dismantlers = 1;
        }

        this._mem.jobs.chemists = 0;
        if (this.terminal !== null && this.labs !== null && this.labs.canRun) {
            this._mem.jobs.chemists = 1;
        }
    }

    prepare () {
        const hostileCreeps = this._room.find(FIND_HOSTILE_CREEPS);
        if (hostileCreeps.length > 0) {
            this.state = C.ROOM_STATE_INVADED;
        }
        else {
            this.state = C.ROOM_STATE_NORMAL;
        }
    }

    tickReservations () {
        if (this._mem.reservations === undefined) {
            return;
        }

        const keys = Object.keys(this._mem.reservations);

        if (keys.length === 0) {
            delete this._mem.reservations;
            return;
        }

        for (const key of keys) {
            this._mem.reservations[key].ttl = this._mem.reservations[key].ttl - 1;
            if (this._mem.reservations[key].ttl === 0) {
                delete this._mem.reservations[key];
            }
        }
    }

    processPower () {
        if (this.powerSpawn !== null) {
            if (this.powerSpawn.energy > 0 && this.powerSpawn.energy > POWER_SPAWN_ENERGY_RATIO) {
                this.powerSpawn.processPower();
            }
        }
    }

    defend () {
        const hostiles = this._room.find(FIND_HOSTILE_CREEPS);

        const damagedCreeps = this._room.find(FIND_MY_CREEPS, {
            filter: (creep) => creep.hits < creep.hitsMax
        });

        if (this.towers.length === 0) {
            return;
        }

        for (const tower of this.towers) {
            if (hostiles.length > 0) {
                if (hostiles[0] !== null) { //  && hostiles[0].pos.y < 49
                    tower.attack(hostiles[0]);
                    continue;
                }
            }

            if (damagedCreeps.length > 0) {
                const damagedCreep = damagedCreeps.pop();
                tower.heal(damagedCreep);
                continue;
            }

            break;
        }
    }

    queueCreep (rule) {
        if (rule === undefined || rule === null) {
            return;
        }

        if (rule.priority === C.SPAWN_PRIORITY_HIGH) {
            this._spawn.high.push(rule);
        }
        else {
            this._spawn.normal.push(rule);
        }
    }

    remember (id, type) {
        if (this._mem.ids === undefined) {
            this._mem.ids = {};
        }
        if (this._mem.ids[type] === undefined) {
            this._mem.ids[type] = [];
        }
        this._mem.ids[type].push(id);
    }

    recall (type) {
        if (this._mem.ids === undefined) {
            return [];
        }
        if (this._mem.ids[type] === undefined) {
            return [];
        }
        const gameObjects = [];
        for (const id of this._mem.ids[type]) {
            const gameObject = Game.getObjectById(id);
            if (gameObject !== null) {
                gameObjects.push(gameObject);
            }
        }
        return gameObjects;
    }

    // https://stackoverflow.com/a/34890276/5097336
    groupBy (xs, key) {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }
}

module.exports = RoomReal;
