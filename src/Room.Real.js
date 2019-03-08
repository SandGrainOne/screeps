'use strict';

let C = require('./constants');

let RoomBase = require('./Room.Base');

let Links = require('./Links');
let Labs = require('./Labs');

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

        // Tick cache
        this._cache = {};

        this._spawn = {};
        this._spawn.high = [];
        this._spawn.normal = [];
    }

    /**
     * Gets the tick number where the room was analyzed.
     */
    get tickAnalyzed () {
        return _.isUndefined(this._mem.tickAnalyzed) ? 0 : this._mem.tickAnalyzed;
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
        if (_.isUndefined(this._room.controller)) {
            return null;
        }
        return this._room.controller;
    }

    /**
     * Gets a value indicating whether the room is owned by current user.
     */
    get isMine () {
        return !_.isNull(this.controller) && this.controller.my;
    }

    /**
     * Gets the room storage if it exists.
     */
    get storage () {
        if (_.isUndefined(this._room.storage) || !this._room.storage.my) {
            return null;
        }
        return this._room.storage;
    }

    /**
     * Gets the room terminal if it exists.
     */
    get terminal () {
        if (_.isUndefined(this._room.terminal) || !this._room.terminal.my) {
            return null;
        }
        return this._room.terminal;
    }

    /**
     * Gets an array with all sources in the room.
     */
    get sources () {
        if (!_.isUndefined(this._cache.sources)) {
            return this._cache.sources;
        }
        this._cache.sources = this.recall('source');
        return this._cache.sources;
    }

    /**
     * Gets the room mineral node if it exists.
     */
    get minerals () {
        if (!_.isUndefined(this._cache.minerals)) {
            return this._cache.minerals;
        }
        let minerals = this.recall('minerals');
        this._cache.minerals = minerals.length > 0 ? minerals[0] : null;
        return this._cache.minerals;
    }

    /**
     * Gets an array with all drops in the room.
     */
    get drops () {
        if (!_.isUndefined(this._cache.drops)) {
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
        if (!_.isUndefined(this._cache.containers)) {
            return this._cache.containers;
        }
        this._cache.containers = this.recall(STRUCTURE_CONTAINER);
        if (this._cache.containers.length > 1) {
            this._cache.containers.sort((a, b) => _.sum(b.store) - _.sum(a.store));
        }
        return this._cache.containers;
    }

    /**
     * Gets the linking system in the room and easy access to individual links.
     */
    get links () {
        if (!_.isUndefined(this._cache.links)) {
            return this._cache.links;
        }
        // Ensure that the linking system has some memory reserved from the room
        if (_.isUndefined(this._mem.links)) {
            this._mem.links = {};
        }
        this._cache.links = new Links(this._mem.links);
        return this._cache.links;
    }

    /**
     * Gets the room extractor if it exists. Otherwise null.
     */
    get extractor () {
        if (!_.isUndefined(this._cache.extractor)) {
            return this._cache.extractor;
        }
        let extractors = this.recall(STRUCTURE_EXTRACTOR);
        this._cache.extractor = extractors.length > 0 ? extractors[0] : null;
        return this._cache.extractor;
    }

    /**
     * Gets the laboratory unit in the room and easy access to individual labs.
     */
    get labs () {
        if (!_.isUndefined(this._cache.labs)) {
            return this._cache.labs;
        }
        // Ensure that the laboratory unit has some memory reserved from the room.
        if (_.isUndefined(this._mem.labs)) {
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
        if (!_.isUndefined(this._cache.towers)) {
            return this._cache.towers;
        }
        this._cache.towers = this.recall(STRUCTURE_TOWER);
        if (this._cache.towers.length > 1) {
            this._cache.towers.sort((a, b) => a.energy - b.energy);
        }
        return this._cache.towers;
    }

    /**
     * Gets an array with all construction sites in the room. Empty if there
     * are no construction sites.
     */
    get constructionSites () {
        if (!_.isUndefined(this._cache.constructionSites)) {
            return this._cache.constructionSites;
        }
        this._cache.constructionSites = this._room.find(FIND_CONSTRUCTION_SITES);
        return this._cache.constructionSites;
    }

    /**
     * Gets an array with all spawns in the room. Empty if there are no spawns.
     */
    get spawns () {
        if (!_.isUndefined(this._cache.spawns)) {
            return this._cache.spawns;
        }
        this._cache.spawns = this.recall(STRUCTURE_SPAWN);
        return this._cache.spawns;
    }

    /**
     * Gets an array with extensions and spawns that have room for energy.
     * Empty if there are no such structure. This should only be used by creeps doing refueling.
     */
    get extensions () {
        if (!_.isUndefined(this._cache.extensions)) {
            return this._cache.extensions;
        }
        this._cache.extensions = [];
        for (let extension of this.recall(STRUCTURE_EXTENSION)) {
            if (extension.energy < extension.energyCapacity) {
                this._cache.extensions.push(extension);
            }
        }
        return this._cache.extensions;
    }

    /**
     * Gets the total energy capacity of all spawns and extensions in the room.
     */
    get energyCapacityAvailable () {
        return this._room.energyCapacityAvailable;
    }

    /**
     * Gets the nuker structure in the room is it exists. Otherwise null.
     */
    get nuker () {
        if (!_.isUndefined(this._cache.nuker)) {
            return this._cache.nuker;
        }
        let nukers = this.recall(STRUCTURE_NUKER);
        this._cache.nuker = nukers.length > 0 ? nukers[0] : null;
        return this._cache.nuker;
    }

    /**
     * Gets the room observer if it exists.
     */
    get observer () {
        if (!_.isUndefined(this._cache.observer)) {
            return this._cache.observer;
        }
        let observers = this.recall(STRUCTURE_OBSERVER);
        this._cache.observer = observers.length > 0 ? observers[0] : null;
        return this._cache.observer;
    }

    /**
     * Gets an array with all keeper lairs in the room. Empty if there are no keeper lairs.
     */
    get keeperLairs () {
        if (!_.isUndefined(this._cache.keeperLairs)) {
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
        if (!_.isUndefined(this._cache.repairs)) {
            return this._cache.repairs;
        }
        this._cache.repairs = [];
        for (let structure of this.recall('repair')) {
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
        if (!_.isUndefined(this._cache.flags)) {
            return this._cache.flags;
        }
        let flagsArray = this._room.find(FIND_FLAGS);
        if (flagsArray.length > 0) {
            this._cache.flags = _.groupBy(flagsArray, 'color');
        }
        else {
            this._cache.flags = {};
        }
        return this._cache.flags;
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
        if (_.isUndefined(this._mem.reservations)) {
            this._mem.reservations = {};
        }

        let key = type + '_' + id;
        if (_.isUndefined(this._mem.reservations[key])) {
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
     * Perform all room spesific logic.
     */
    run () {
        // Prepare the room for the current tick.
        this.prepare();

        // Let the towers do their thing
        this.defend();

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

        let labs = [];
        let links = [];

        for (let source of this._room.find(FIND_SOURCES)) {
            this.remember(source.id, 'source');
        }

        for (let minerals of this._room.find(FIND_MINERALS)) {
            this.remember(minerals.id, 'minerals');
        }

        for (let structure of this._room.find(FIND_STRUCTURES)) {
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
                case STRUCTURE_RAMPART:
                    this.remember(structure.id, STRUCTURE_RAMPART);
                    break;
                case STRUCTURE_TOWER:
                    this.remember(structure.id, STRUCTURE_TOWER);
                    break;
                case STRUCTURE_NUKER:
                    this.remember(structure.id, STRUCTURE_NUKER);
                    break;
                case STRUCTURE_SPAWN:
                    this.remember(structure.id, STRUCTURE_SPAWN);
                    // Adding spawns to the extensions collection for the purpose of refueling
                    this.remember(structure.id, STRUCTURE_EXTENSION);
                    break;
                case STRUCTURE_EXTENSION:
                    this.remember(structure.id, STRUCTURE_EXTENSION);
                    break;
                case STRUCTURE_OBSERVER:
                    this.remember(structure.id, STRUCTURE_OBSERVER);
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

        if (_.isUndefined(this._mem.tickClaimed) && this.isMine) {
            this._mem.tickClaimed = Game.time;
        }
        if (!_.isUndefined(this._mem.tickClaimed) && !this.isMine) {
            delete this._mem.tickClaimed;
        }

        this.tickAnalyzed = Game.time;
    }

    checkRepairs (structure) {
        let greyFlags = this.flags[COLOR_GREY];

        if (_.isArray(greyFlags)) {
            for (let greyFlag of greyFlags) {
                if (structure.pos.isEqualTo(greyFlag)) {
                    return;
                }
            }
        }

        let hitsMax = 0;
        let wallSize = 3000000;

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
                // Allow roads to decay a little bit. This is so that a builder would need to spend a
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

    createJobs () {
        this._mem.jobs.miners = this.sources.length;
        this._mem.jobs.haulers = this.containers.length + this._room.terminal ? 1 : 0;

        this._mem.jobs.mineralminers = 0;
        if (this.minerals && this.minerals.mineralAmount > 0 && this.extractor) {
            this._mem.jobs.mineralminers = 1;
        }

        this._mem.jobs.refuelers = 0;
        if (this.storage) {
            this._mem.jobs.refuelers = 2;
        }

        this._mem.jobs.linkers = 0;
        if (!_.isNull(this.storage) && !_.isNull(this.links.storage)) {
            this._mem.jobs.linkers = 1;
        }

        this._mem.jobs.settlers = 0;
        if (this._room.controller && this._room.controller.reservation) {
            if (this._room.controller.reservation.username === C.USERNAME && this._room.controller.reservation.ticksToEnd < 4000) {
                this._mem.jobs.settlers = 1;
            }
        }
    }

    prepare () {
        let hostileCreeps = this._room.find(FIND_HOSTILE_CREEPS);
        if (hostileCreeps.length > 0) {
            this.state = C.ROOM_STATE_INVADED;
        }
        else {
            this.state = C.ROOM_STATE_NORMAL;
        }
    }

    tickReservations () {
        if (_.isUndefined(this._mem.reservations)) {
            return;
        }

        let keys = Object.keys(this._mem.reservations);

        if (keys.length <= 0) {
            delete this._mem.reservations;
            return;
        }

        for (let key of keys) {
            this._mem.reservations[key].ttl = this._mem.reservations[key].ttl - 1;
            if (this._mem.reservations[key].ttl === 0) {
                delete this._mem.reservations[key];
            }
        }
    }

    defend () {
        let hostiles = this._room.find(FIND_HOSTILE_CREEPS);

        if (this.towers.length === 0) {
            return;
        }

        for (let tower of this.towers) {
            let hostileCreep = tower.pos.findClosestByRange(hostiles);

            if (hostileCreep !== null && hostileCreep.pos.y < 49) {
                tower.attack(hostileCreep);
                continue;
            }

            let damagedCreeps = tower.room.find(FIND_MY_CREEPS, {
                filter: (creep) => {
                    return creep.hits < creep.hitsMax;
                }
            });

            if (damagedCreeps.length > 0) {
                tower.heal(damagedCreeps[0]);
                continue;
            }
        }
    }

    queueCreep (rule) {
        if (!rule) {
            return;
        }

        if (rule.priority === C.SPAWN_PRIORITY_HIGH) {
            this._spawn.high.push(rule);
        }
        else {
            this._spawn.normal.push(rule);
        }
    }

    performSpawning () {
        if (this._spawn.high.length <= 0 && this._spawn.normal.length <= 0) {
            return;
        }

        for (let spawn of this.spawns) {
            if (spawn.spawning) {
                continue;
            }

            let rule = null;
            if (this._spawn.high.length > 0) {
                rule = this._spawn.high.shift();
            }

            if (!rule && this._spawn.normal.length > 0) {
                rule = this._spawn.normal.shift();
            }

            if (!rule) {
                return;
            }

            Empire.createCreep(rule.job, null, spawn.name, rule.body, this.name, rule.workRoom);
        }
    }

    remember (id, type) {
        if (_.isUndefined(this._mem.ids)) {
            this._mem.ids = {};
        }
        if (_.isUndefined(this._mem.ids[type])) {
            this._mem.ids[type] = [];
        }
        this._mem.ids[type].push(id);
    }

    recall (type) {
        if (_.isUndefined(this._mem.ids)) {
            return [];
        }
        if (_.isUndefined(this._mem.ids[type])) {
            return [];
        }
        let gameObjects = [];
        for (let id of this._mem.ids[type]) {
            let gameObject = Game.getObjectById(id);
            if (!_.isNull(gameObject)) {
                gameObjects.push(gameObject);
            }
        }
        return gameObjects;
    }
}

module.exports = RoomReal;
