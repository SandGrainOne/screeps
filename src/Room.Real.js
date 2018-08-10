'use strict';

let C = require('constants');

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
        this._visible = true;

        // Tick cache
        this._cache = {};
    }

    /**
     * Gets the room controller if it exists. Otherwise undefined.
     */
    get controller() {
        return this._room.controller;
    }

    /**
     * Gets a value indicating whether the room is owned by current user.
     */
    get isMine() {
        return (this.controller !== undefined) && this.controller.my;
    }

    /**
     * Gets the room storage if it exists. Otherwise undefined.
     */
    get storage() {
        if (this._room.storage) {
            return this._room.storage;
        }

        if (this._mem.structures && this._mem.structures.miniStorage) {
            return Game.getObjectById(this._mem.structures.miniStorage);
        }

        return null;
    }

    /**
     * Gets the room terminal if it exists. Otherwise undefined.
     */
    get terminal() {
        return this._room.terminal;
    }

    /**
     * Gets an array with all sources in the room.
     */
    get sources() {
        if (this._cache.sources !== undefined) {
            return this._cache.sources;
        }
        let sources = this._room.find(FIND_SOURCES);
        return this._cache.sources = sources;
    }

    /**
     * Gets a value indicating whether the room has a minable mineral node. This takes into consideration
     * that the mineral node has minerals and that the extractor is usable by current user.
     */
    get hasMinerals() {
        return this._mem.hasHarvestableMinerals || false;
    }

    /**
     * Gets the room mineral node if it is mineable.
     * Always use hasMinerals before calling this.
     */
    get minerals() {
        if (this._cache.minerals !== undefined) {
            return this._cache.minerals;
        }
        if (this.hasMinerals) {
            return this._cache.minerals = this._room.find(FIND_MINERALS)[0];
        }
        return undefined;
    }

    /**
     * Gets the room extractor node if it is mineable.
     * Always use hasMinerals before calling this.
     */
    get extractor() {
        if (this._cache.extractor !== undefined) {
            return this._cache.extractor;
        }
        if (this.hasMinerals) {
            return this._cache.extractor = this._room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_EXTRACTOR })[0];
        }
        return undefined;
    }

    /**
     * Gets an array with all containers in the room sorted decending based the amount stored.
     */
    get containers() {
        if (this._cache.containers !== undefined) {
            return this._cache.containers;
        }

        let allContainers = this._room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_CONTAINER });

        let containers = [];
        for (let container of allContainers) {
            if (container.id !== this._mem.structures.miniStorage) {
                containers.push(container);
            }
        }

        if (containers.length > 1) {
            containers.sort((a, b) => _.sum(b.store) - _.sum(a.store));
        }

        return this._cache.containers = containers;
    }

    /**
     * Gets an array with all drops in the room sorted decending based the amount of resources.
     */
    get drops() {
        if (this._cache.drops !== undefined) {
            return this._cache.drops;
        }
        let drops = this._room.find(FIND_DROPPED_RESOURCES);
        if (drops.length > 1) {
            // TODO: Weight some resources more valuable than others?
            // (b.resourceType !== RESOURCE_ENERGY ? 100 : 0)
            drops.sort((a, b) => _.sum(b.amount) - _.sum(a.amount));
        }
        return this._cache.drops = drops;
    }

    /**
     * Gets an array with all towers in the room sorted ascending based the amount of energy in the towers.
     */
    get towers() {
        if (this._cache.towers !== undefined) {
            return this._cache.towers;
        }
        let towers = this._room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_TOWER });
        if (towers.length > 1) {
            towers.sort((a, b) => a.energy - b.energy);
        }
        return this._cache.towers = towers;
    }

    /**
     * Gets an array with all construction sites in the room.
     */
    get constructionSites() {
        if (this._cache.constructionSites !== undefined) {
            return this._cache.constructionSites;
        }
        let constructionSites = this._room.find(FIND_CONSTRUCTION_SITES);
        return this._cache.constructionSites = constructionSites;
    }

    /**
     * Gets the nuker structure in the room is it exists.
     */
    get nuker() {
        if (this._cache.nuker !== undefined) {
            return this._cache.nuker;
        }
        let nukers = this._room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_NUKER });
        let nuker = nukers.length > 0 ? nukers[0] : null;
        return this._cache.nuker = nuker;
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

    populate() {
        this._mem.jobs = { 
            settlers: 0,
            builders: 0,
            upgraders: 0,
            haulers: 0,
            miners: 0,
            mineralminers: 0,
            refuelers: 0
        };

        this._mem.jobs.miners = this.sources.length;

        this._mem.jobs.haulers = this.containers.length + this._room.terminal ? 1 : 0;

        if (this.hasMinerals) {
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

        this._mem.structures = {};
        this._mem.structures.spawns = [];
        this._mem.structures.extensions = [];
        this._mem.structures.miniStorage = null;
        this._mem.structures.links = {};
        this._mem.structures.links.storage = null;
        this._mem.structures.links.controller = null;
        this._mem.structures.links.inputs = [];
        this._mem.structures.links.all = [];
        this._mem.structures.labs = {};
        this._mem.structures.labs.all = [];
        this._mem.structures.labs.rOne = null;
        this._mem.structures.labs.rTwo = null;
        this._mem.structures.labs.producers = [];
        
        this._mem.hasHarvestableMinerals = false;

        // Need to handle Labs multiple times in order to identify the roles.
        let labs = [];

        for (let structure of this._room.find(FIND_STRUCTURES)) {

            if (structure.structureType === STRUCTURE_EXTRACTOR) {
                // Check that we have access to the extractor and that the
                // mineral node has something to harvest.
                if (structure.owner === undefined || structure.my) {
                    let minerals = structure.pos.lookFor(LOOK_MINERALS);
                    if (minerals.length > 0 && minerals[0].mineralAmount > 0) {
                        this._mem.hasHarvestableMinerals = true;
                    }
                }
            }

            if (structure.structureType === STRUCTURE_CONTAINER) {
                if (!this._room.storage) {
                    let spawnsInRange = structure.pos.findInRange(FIND_MY_SPAWNS, 1);
                    if (spawnsInRange.length > 0) {
                        this._mem.structures.miniStorage = spawnsInRange[0].id;
                    }
                }
            }

            if (!this.isMine) {
                continue;
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
                this._mem.structures.links.all.push(structure.id);

                let rangeToStorage = structure.pos.getRangeTo(this.storage);
                let rangeToController = structure.pos.getRangeTo(this.controller);

                if (Math.min(rangeToStorage, rangeToController) > 5) {
                    //let energyInRange = structure.pos.findInRange(FIND_SOURCES, 1);
                    //if (energyInRange.length === 0) {
                    //    this._mem.structures.links.storage = structure.id;
                    //}
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
    }

    tickReservations() {
        for (let key in this._mem.reservations) {
            this._mem.reservations[key].ttl = this._mem.reservations[key].ttl - 1;
            if (this._mem.reservations[key].ttl === 0) {
                delete this._mem.reservations[key];
            }
        }
    }

    prepare() {
        // Create a quick access array for all spawns.
        this.Spawns = [];
        if (this._mem.structures && this._mem.structures.spawns) {
            for (let spawnId of this._mem.structures.spawns) {
                let spawn = Game.getObjectById(spawnId);
                if (spawn) {
                    this.Spawns.push(spawn);
                }
            }
        }

        // Create a quick access array for extensions (and spawns).
        this.Extensions = [];
        if (this._mem.structures && this._mem.structures.extensions) {
            for (let extensionId of this._mem.structures.extensions) {
                let extension = Game.getObjectById(extensionId);
                if (extension && extension.energy < extension.energyCapacity) {
                    this.Extensions.push(extension);
                }
            }
        }

        // Create a quick access array of all the room links.
        this.Links = {};
        this.Links.Controller = null;
        this.Links.Storage = null;
        this.Links.Inputs = [];
        this.Links.All = [];
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
            if (this._mem.structures.links.all) {
                for (let linkId of this._mem.structures.links.all) {
                    let link = Game.getObjectById(linkId);
                    if (link) {
                        this.Links.All.push(link);
                    }
                }
            }
        }

        this.Labs = {};
        this.Labs.All = [];
        this.Labs.compoundOne = null;
        this.Labs.compoundTwo = null;
        this.Labs.producers = [];
        this.Labs.Refuel = [];
        if (this._mem.structures.labs.all.length > 0) {
            for (let labId of this._mem.structures.labs.all) {
                let lab = Game.getObjectById(labId);
                if (lab) {
                    this.Labs.All.push(lab);
                    if (labId === this._mem.structures.labs.rOne) {
                        this.Labs.compoundOne = lab;
                    }
                    else if (labId === this._mem.structures.labs.rTwo) {
                        this.Labs.compoundTwo = lab;
                    }
                    else {
                        this.Labs.producers.push(lab);
                    }
                    if (lab.energy < lab.energyCapacity - 400) {
                        this.Labs.Refuel.push(lab);
                    }
                }
            }
        }

        this.Repairs = [];
        let structures = this._room.find(FIND_STRUCTURES);
        if (structures.length > 0) {
            for (let structure of structures) {
                if (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART) {
                    if (this.isMine) {
                        if (structure.hits < 2000000) {
                            this.Repairs.push(structure);
                        }
                    }
                }
                else {
                    if (structure.hits < structure.hitsMax - 1000) {
                        this.Repairs.push(structure);
                    }
                }

                if (this.Repairs.length >= 5) {
                    break;
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

        let wallCount = this._room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_WALL }).length;
        if (wallCount > 0) {
            if (this._mem.wallcount > wallCount) {
                if (this.isMine && !this._room.controller.safeMode) {
                    let hostiles = this._room.find(FIND_HOSTILE_CREEPS).length;
                    if (hostiles > 1) {
                        this._room.controller.activateSafeMode();
                    }
                }
            }
            
            if (this._mem.wallcount < wallCount) {
                this._mem.wallcount = wallCount;
            }
        }

        let rampCount = this._room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_RAMPART }).length;
        if (rampCount > 0) {
            if (this._mem.rampcount > rampCount) {
                if (this.isMine && !this._room.controller.safeMode) {
                    let hostiles = this._room.find(FIND_HOSTILE_CREEPS).length;
                    if (hostiles > 1) {
                        this._room.controller.activateSafeMode();
                    }
                }
            }

            if (this._mem.rampcount < rampCount) {
                this._mem.rampcount = rampCount;
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

            /*
            if (tower.energy < tower.energyCapacity - 200) {
                continue;
            }

            let containerToRepair = tower.pos.findClosestByRange(FIND_STRUCTURES, { 
                filter: function (s) { 
                    return s.structureType === STRUCTURE_CONTAINER && (s.hits < s.hitsMax); 
                } 
            });

            if (containerToRepair !== null) {
                tower.repair(containerToRepair);
                continue;
            } 

            let rampartToRepair = tower.pos.findClosestByRange(FIND_STRUCTURES, { 
                filter: (s) => { 
                    return s.structureType === STRUCTURE_RAMPART && (s.hits < 1100000);
                } 
            });

            if (rampartToRepair !== null) {
                tower.repair(rampartToRepair);
                continue;
            }

            let wallToRepair = tower.pos.findClosestByRange(FIND_STRUCTURES, { 
                filter: (wall) => { 
                    return wall.structureType === STRUCTURE_WALL && (wall.hits < 1100000);
                } 
            });

            if (wallToRepair !== null) {
                tower.repair(wallToRepair);
                continue;
            } 
            
            let roadToRepair = tower.pos.findClosestByRange(FIND_STRUCTURES, { 
                filter: function (road) { 
                    return road.structureType === STRUCTURE_ROAD && (road.hits < road.hitsMax); 
                } 
            });

            if (roadToRepair !== null) {
                tower.repair(roadToRepair);
                continue;
            }
            */
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
}

module.exports = RoomReal;
