'use strict';

let C = require('constants');

let CreepMaker = require('CreepMaker');
let RoomBase = require('Room.Base');

/**
 * Wrapper class with basic logic for rooms.
 */
class RoomReal extends RoomBase {
    /**
     * Initializes a new instance of the RoomBase class with the specified room.
     * 
     * @param {Room} room - The room to be wrapped.
     */
    constructor(room) {
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
     * Gets the room controller if it exists. Otherwise null.
     */
    get controller() {
        return this._room.controller || null;
    }

    /**
     * Gets a value indicating whether the room is owned by current user.
     */
    get isMine() {
        return !!this.controller && this.controller.my;
    }

    /**
     * Gets the room storage if it exists. Otherwise null.
     */
    get storage() {
        return this._room.storage || null;
    }

    /**
     * Gets the room terminal if it exists. Otherwise null.
     */
    get terminal() {
        return this._room.terminal || null;
    }

    /**
     * Gets an array with all sources in the room. Empty if there are no sources.
     */
    get sources() {
        if (this._cache.sources !== undefined) {
            return this._cache.sources;
        }

        this._cache.sources = [];
        if (this._mem.resources.sources && this._mem.resources.sources.length > 0) {
            for (let id of this._mem.resources.sources) {
                let source = Game.getObjectById(id);
                if (source) {
                    this._cache.sources.push(source);
                }
            }
        }

        return this._cache.sources;
    }

    /**
     * Gets the room mineral node if it exists. Otherwise null.
     */
    get minerals() {
        if (this._cache.minerals !== undefined) {
            return this._cache.minerals;
        }

        this._cache.minerals = null;
        if (this._mem.resources.minerals) {
            let minerals = Game.getObjectById(this._mem.resources.minerals);
            if (minerals) {
                this._cache.minerals = minerals;
            }
        }

        return this._cache.minerals;
    }

    /**
     * Gets an array with all containers in the room. Empty if there are no containers.
     * The array is sorted decending based the amount stored. Used by haulers to prioritise
     * containers with the most resources.
     */
    get containers() {
        if (this._cache.containers !== undefined) {
            return this._cache.containers;
        }

        this._cache.containers = [];
        if (this._mem.structures.containers && this._mem.structures.containers.length > 0) {
            for (let id of this._mem.structures.containers) {
                let container = Game.getObjectById(id);
                if (container) {
                    this._cache.containers.push(container);
                }
            }

            if (this._cache.containers.length > 1) {
                this._cache.containers.sort((a, b) => _.sum(b.store) - _.sum(a.store));
            }
        }

        return this._cache.containers;
    }

    /**
     * Gets the room extractor if it exists. Otherwise null.
     */
    get extractor() {
        if (this._cache.extractor !== undefined) {
            return this._cache.extractor;
        }

        this._cache.extractor = null;
        if (this._mem.structures.extractor) {
            let extractor = Game.getObjectById(this._mem.structures.extractor);
            if (extractor) {
                this._cache.extractor = extractor;
            }
        }

        return this._cache.extractor;
    }

    /**
     * Gets an array with all drops in the room. Empty if there are no drops. 
     */
    get drops() {
        if (this._cache.drops !== undefined) {
            return this._cache.drops;
        }

        // TODO: Sort or prioritise the drops in some way?
        return this._cache.drops = this._room.find(FIND_DROPPED_RESOURCES);
    }

    /**
     * Gets an array with all towers in the room. Empty if there are no towers.
     * The array is sorted ascending based the amount of energy stored. Used by 
     * refuelers to prioritise towers with the least resources.
     */
    get towers() {
        if (this._cache.towers !== undefined) {
            return this._cache.towers;
        } 

        this._cache.towers = [];
        if (this._mem.structures.towers && this._mem.structures.towers.length > 0) {
            for (let id of this._mem.structures.towers) {
                let tower = Game.getObjectById(id);
                if (tower) {
                    this._cache.towers.push(tower);
                }
            }

            if (this._cache.towers.length > 1) {
                this._cache.towers.sort((a, b) => a.energy - b.energy);
            }
        }

        return this._cache.towers;
    }

    /**
     * Gets an array with all construction sites in the room. Empty if there
     * are no construction sites.
     */
    get constructionSites() {
        if (this._cache.constructionSites !== undefined) {
            return this._cache.constructionSites;
        }

        return this._cache.constructionSites = this._room.find(FIND_CONSTRUCTION_SITES);
    }

    /**
     * Gets an array with all spawns in the room. Empty if there are no spawns.
     */
    get spawns() {
        if (this._cache.spawns !== undefined) {
            return this._cache.spawns;
        }

        this._cache.spawns = [];
        if (this._mem.structures.spawns && this._mem.structures.spawns.length > 0) {
            for (let id of this._mem.structures.spawns) {
                let spawn = Game.getObjectById(id);
                if (spawn) {
                    this._cache.spawns.push(spawn);
                }
            }
        }

        return this._cache.spawns;
    }

    /**
     * Gets an array with extensions and spawns that have room for energy.
     * Empty if there are no such structure. This should only be used by creeps doing refueling.
     */
    get extensions() {
        if (this._cache.extensions !== undefined) {
            return this._cache.extensions;
        }

        this._cache.extensions = [];
        if (this._mem.structures.extensions && this._mem.structures.extensions.length > 0) {
            for (let id of this._mem.structures.extensions) {
                let extension = Game.getObjectById(id);
                if (extension && extension.energy < extension.energyCapacity) {
                    this._cache.extensions.push(extension);
                }
            }
        }

        return this._cache.extensions;
    }

    /**
     * Gets the total energy capacity of all spawns and extensions in the room.
     */
    get energyCapacityAvailable() {
        return this._room.energyCapacityAvailable;
    }

    /**
     * Gets the nuker structure in the room is it exists. Otherwise null.
     */
    get nuker() {
        if (this._cache.nuker !== undefined) {
            return this._cache.nuker;
        }

        this._cache.nuker = null;
        if (this._mem.structures.nuker) {
            let nuker = Game.getObjectById(this._mem.structures.nuker);
            if (nuker) {
                this._cache.nuker = nuker;
            }
        }

        return this._cache.nuker;
    }

    /**
     * Gets an array with all keeper lairs in the room. Empty if there are no keeper lairs.
     */
    get keeperLairs() {
        if (this._cache.keeperLairs !== undefined) {
            return this._cache.keeperLairs;
        }

        this._cache.keeperLairs = [];
        if (this._mem.structures.keeperLairs && this._mem.structures.keeperLairs.length > 0) {
            for (let id of this._mem.structures.keeperLairs) {
                let keeperLair = Game.getObjectById(id);
                if (keeperLair) {
                    this._cache.keeperLairs.push(keeperLair);
                }
            }

            if (this._cache.keeperLairs.length > 1) {
                this._cache.keeperLairs.sort((a, b) => a.ticksToSpawn - b.ticksToSpawn);
            }
        }

        return this._cache.keeperLairs;
    }

    /**
     * Gets an array of structures that need repairs. Empty if there are no such structures.
     */
    get repairs() {
        if (this._cache.repairs !== undefined) {
            return this._cache.repairs;
        }

        this._cache.repairs = [];
        if (this._mem.structures.repairs && this._mem.structures.repairs.length > 0) {
            for (let id of this._mem.structures.repairs) {
                let structure = Game.getObjectById(id);
                if (structure) {
                    if (structure.hits < structure.hitsMax) {
                        this._cache.repairs.push(structure);
                    }
                    else {
                        // TODO: Remove the id of structures that are repaired?
                    }
                }
                else {
                    // TODO: Was the structure destroyed by an enemy?
                }

                if (this._cache.repairs.length > 5) {
                    break;
                }
            }
        }

        return this._cache.repairs;
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
     * Perform an analysis of the room once every 50-60 ticks.
     * 
     * @param {Boolean} force - Perform an analysis of the room right away. Ignore the update schedule.
     */
    analyze(force) {
        if (!force && this._mem.update.next >= Game.time) {
            return;
        }

        // Prepare next update.
        this._mem.update.next = Game.time + 50 + Math.floor(Math.random() * 10);
        this._mem.update.last = Game.time;

        this._mem.resources = {};
        this._mem.resources.sources = [];
        this._cache.sources = [];

        this._mem.resources.minerals = null;
        this._cache.minerals = null;

        for (let source of this._room.find(FIND_SOURCES)) {
            this._mem.resources.sources.push(source.id);
            this._cache.sources.push(source);
        }

        for (let minerals of this._room.find(FIND_MINERALS)) {
            this._mem.resources.minerals = minerals.id;
            this._cache.minerals = minerals;
        }

        this._mem.structures = {};
        this._mem.structures.spawns = [];
        this._mem.structures.extensions = [];

        this._mem.structures.containers = [];
        this._cache.containers = [];

        this._mem.structures.extractor = null;
        this._mem.structures.towers = [];
        this._mem.structures.ramparts = [];
        this._mem.structures.nuker = null;
        this._mem.structures.keeperLairs = [];
        this._mem.structures.links = {};
        this._mem.structures.links.storage = null;
        this._mem.structures.links.controller = null;
        this._mem.structures.links.inputs = [];
        this._mem.structures.labs = {};
        this._mem.structures.labs.all = [];
        this._mem.structures.labs.rOne = null;
        this._mem.structures.labs.rTwo = null;
        this._mem.structures.labs.producers = [];
        this._mem.structures.repairs = [];

        this._mem.hasHarvestableMinerals = false;

        // In the first loop the labs are only collected in this array.
        // The labs are later reorganized properly.
        let labs = [];

        for (let structure of this._room.find(FIND_STRUCTURES)) {

            if (structure.structureType === STRUCTURE_CONTAINER) {
                this._mem.structures.containers.push(structure.id);
                this._cache.containers.push(structure);
                if (structure.hits < structure.hitsMax) {
                    this._mem.structures.repairs.push(structure.id);
                }
            }

            if (structure.structureType === STRUCTURE_ROAD) {
                // Allow roads to decay a little bit.
                // This is so that a builder need to spend a litle bit more time on it.
                if (structure.hits < structure.hitsMax - 1000) {
                    this._mem.structures.repairs.push(structure.id);
                }
            }

            if (structure.structureType === STRUCTURE_WALL) {
                if (structure.hits < 2000000) {
                    this._mem.structures.repairs.push(structure.id);
                }
            }

            if (structure.structureType === STRUCTURE_EXTRACTOR) {
                // Check that we have access to the extractor
                if (structure.owner === undefined || structure.my) {
                    let minerals = structure.pos.lookFor(LOOK_MINERALS);
                    // Check that the mineral node has something to harvest.
                    if (minerals.length > 0 && minerals[0].mineralAmount > 0) {
                        this._mem.hasHarvestableMinerals = true;
                    }

                    this._mem.structures.extractor = structure.id;
                }
            }

            if (structure.structureType === STRUCTURE_KEEPER_LAIR) {
                this._mem.structures.keeperLairs.push(structure.id);
            }

            if (!this.isMine) {
                continue;
            }

            if (structure.structureType === STRUCTURE_RAMPART) {
                this._mem.structures.ramparts.push(structure.id);
                // TODO: Create a way to determine a good wall size
                if (structure.hits < 2000000) {
                    this._mem.structures.repairs.push(structure.id);
                }
            }

            if (structure.structureType === STRUCTURE_TOWER) {
                this._mem.structures.towers.push(structure.id);
            }

            if (structure.structureType === STRUCTURE_NUKER) {
                this._mem.structures.nuker = structure.id;
            }

            if (structure.structureType === STRUCTURE_SPAWN) {
                this._mem.structures.spawns.push(structure.id);

                // Adding all spawns to the extensions collection for the purpose of refueling
                this._mem.structures.extensions.push(structure.id);
            }

            if (structure.structureType === STRUCTURE_EXTENSION) {
                this._mem.structures.extensions.push(structure.id);
            }

            if (structure.structureType === STRUCTURE_LINK) {
                let rangeToStorage = structure.pos.getRangeTo(this.storage);
                let rangeToController = structure.pos.getRangeTo(this.controller);

                if (Math.min(rangeToStorage, rangeToController) > 3) {
                    this._mem.structures.links.inputs.push(structure.id);
                }
                else if (rangeToController < rangeToStorage) {
                    this._mem.structures.links.controller = structure.id;
                }
                else {
                    this._mem.structures.links.storage = structure.id;
                }
            }

            if (structure.structureType === STRUCTURE_LAB) {
                this._mem.structures.labs.all.push(structure.id);
                labs.push(structure);
            }
        }

        if (labs.length > 2) {
            labs.sort(function(a, b) { return (a.pos.x + a.pos.y * 10) - (b.pos.x + b.pos.y * 10) });
            let r1 = Math.floor((labs.length - 1) / 2) - 1;
            let r2 = r1 + Math.ceil((r1 + 2) / 2);
            for (let i = 0; i < labs.length; i++) {
                if (i === r1) {
                    this._mem.structures.labs.rOne = labs[i].id;
                }
                else if (i === r2) {
                    this._mem.structures.labs.rTwo = labs[i].id;
                }
                else {
                    this._mem.structures.labs.producers.push(labs[i].id);
                }
            }
        }

        this.makeJobs();
    }

    createJobs() {
        this._mem.jobs.miners = this.sources.length;

        this._mem.jobs.haulers = this.containers.length + this._room.terminal ? 1 : 0;

        if (this.minerals && this.minerals.mineralAmount > 0 && this.extractor) {
            this._mem.jobs.mineralminers = 1;
        }

        if (this._room.storage) {
            this._mem.jobs.refuelers = 2;
        }

        if (this._room.controller && this._room.controller.reservation) {
            if (this._room.controller.reservation.username === C.USERNAME && this._room.controller.reservation.ticksToEnd < 4000){
                this._mem.jobs.settlers = 1;
            }
        }
    }

    makeJobs() {
        let jobs = CreepMaker.defineJobs(this);
    }

    prepare() {
        this.Links = {};
        this.Links.Controller = null;
        this.Links.Storage = null;
        this.Links.Inputs = [];
        if (this._mem.structures && this._mem.structures.links) {
            if (this._mem.structures.links.controller) {
                let controllerLink = Game.getObjectById(this._mem.structures.links.controller);
                if (controllerLink) {
                    this.Links.Controller = controllerLink;
                }
            }
            if (this._mem.structures.links.storage) {
                let storageLink = Game.getObjectById(this._mem.structures.links.storage);
                if (storageLink) {
                    this.Links.Storage = storageLink;
                }
            }
            if (this._mem.structures.links.inputs) {
                for (let linkId of this._mem.structures.links.inputs) {
                    let inputLink = Game.getObjectById(linkId);
                    if (inputLink) {
                        this.Links.Inputs.push(inputLink);
                    }
                }
            }
        }

        this.Labs = {};
        this.Labs.compoundOne = null;
        this.Labs.compoundTwo = null;
        this.Labs.producers = [];
        if (this._mem.structures.labs.all.length > 0) {
            for (let labId of this._mem.structures.labs.all) {
                let lab = Game.getObjectById(labId);
                if (lab) {
                    if (labId === this._mem.structures.labs.rOne) {
                        this.Labs.compoundOne = lab;
                    }
                    else if (labId === this._mem.structures.labs.rTwo) {
                        this.Labs.compoundTwo = lab;
                    }
                    else {
                        this.Labs.producers.push(lab);
                    }
                }
            }
        }

        let hostileCreeps = this._room.find(FIND_HOSTILE_CREEPS);
        if (hostileCreeps.length > 0) {
            this._mem.state = C.ROOM_STATE_INVADED;
        }
        else {
            this._mem.state = C.ROOM_STATE_NORMAL;
        }
    }

    tickReservations() {
        for (let key in this._mem.reservations) {
            this._mem.reservations[key].ttl = this._mem.reservations[key].ttl - 1;
            if (this._mem.reservations[key].ttl === 0) {
                delete this._mem.reservations[key];
            }
        }
    }

    runReactions() {
        if (this.Labs.producers.length > 0) {
            for (let producer of this.Labs.producers) {
                if ((producer.cooldown || 0) === 0) {
                    producer.runReaction(this.Labs.compoundOne,this.Labs.compoundTwo);
                }
            }
        }
    }

    defend() {
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

    linking() {
        if (this.Links.Inputs.length === 0) {
            return;
        }

        let roomLinks = [];
        if (this.Links.Controller) {
            roomLinks.push(this.Links.Controller);
        }
        if (this.Links.Storage) {
            roomLinks.push(this.Links.Storage);
        }

        for (let inputLink of this.Links.Inputs) {
            if (inputLink.cooldown > 0 || inputLink.energy < 100) {
                continue;
            }

            let performedTransfer = false;
            for (let roomLink of roomLinks) {
                if (roomLink.energy < roomLink.energyCapacity - 200) {
                    let amount = Math.min(inputLink.energy, roomLink.energyCapacity - roomLink.energy)
                    let res = inputLink.transferEnergy(roomLink, amount);
                    performedTransfer = true;
                    break;
                }
            }

            if (performedTransfer) {
                break;
            }
        }

        if (this.Links.Controller && this.Links.Storage) {
            let storageLink = this.Links.Storage;
            if (storageLink.cooldown === 0 && storageLink.energy > 0) {
                let controllerLink = this.Links.Controller;
                if (controllerLink.energy < controllerLink.energyCapacity) {
                    let amount = Math.min(storageLink.energy, controllerLink.energyCapacity - controllerLink.energy)
                    let res = storageLink.transferEnergy(controllerLink, amount);
                }
            }
        }
    }

    queueCreep(rule) {
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

    performSpawning() {
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
}

module.exports = RoomReal;
