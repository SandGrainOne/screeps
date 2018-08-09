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
        this.room = room;
    }

    get Controller() {
        if (this.room.controller) {
            return this.room.controller;
        }
        return null;
    }

    reserveTarget(targetId, creepName) {
        if (!this.mem.targets[targetId]) {
            this.mem.targets[targetId] = { creepName: creepName, ttl: 2 };
            return true;
        }
        if (this.mem.targets[targetId].creepName === creepName) {
            this.mem.targets[targetId].ttl = 2;
            return true;
        }
        return false;
    }

    update() {
        // Perform an analysis of the room every 50-60 ticks.
        this.analyze();

        // Update TTL values on all target reservations and remove those that have expired.
        for (let targetId in this.mem.targets) {
            this.mem.targets[targetId].ttl = this.mem.targets[targetId].ttl - 1;
            if (this.mem.targets[targetId].ttl === 0) {
                delete this.mem.targets[targetId];
            }
        }

        // Create a quick access array of all the room sources.
        this.Resources = {};
        this.Resources.Sources = [];
        this.Resources.Minerals = [];
        if (this.mem.resources) {
            if (this.mem.resources.sources) {
                for (let sourceId of this.mem.resources.sources) {
                    let source = Game.getObjectById(sourceId);
                    if (source) {
                        this.Resources.Sources.push(source);
                    }
                }
            }
            if (this.mem.resources.minerals) {
                for (let mineralId of this.mem.resources.minerals) {
                    let mineral = Game.getObjectById(mineralId);
                    if (mineral) {
                        this.Resources.Minerals.push(mineral);
                    }
                }
            }
        }

        this.Resources.Drops = [];
        for (let resourceDrop of this.room.find(FIND_DROPPED_RESOURCES)) {
            if (resourceDrop.resourceType !== RESOURCE_ENERGY || resourceDrop.amount > 30) {
                let atContainer = false;
                for (let structure of resourceDrop.pos.lookFor(LOOK_STRUCTURES)) {
                    if (structure.structureType === STRUCTURE_CONTAINER) {
                        atContainer = true;
                    }
                }
                if (!atContainer) {
                    this.Resources.Drops.push(resourceDrop);
                }
            }
        }

        // Create a quick access array for all containers.
        this.Containers = [];
        if (this.mem.structures && this.mem.structures.containers) {
            for (let containerId of this.mem.structures.containers) {
                let container = Game.getObjectById(containerId);
                if (container) {
                    this.Containers.push(container);
                }
            }
            if (this.Containers.length > 1) {
                this.Containers.sort(function(a, b) { return _.sum(b.store) - _.sum(a.store) });
            }
        }

        // Create a quick access array for all spawns.
        this.Spawns = [];
        if (this.mem.structures && this.mem.structures.spawns) {
            for (let spawnId of this.mem.structures.spawns) {
                let spawn = Game.getObjectById(spawnId);
                if (spawn) {
                    this.Spawns.push(spawn);
                }
            }
        }

        // Create a quick access array for extensions (and spawns).
        this.Extensions = [];
        if (this.mem.structures && this.mem.structures.extensions) {
            for (let extensionId of this.mem.structures.extensions) {
                let extension = Game.getObjectById(extensionId);
                if (extension && extension.energy < extension.energyCapacity) {
                    this.Extensions.push(extension);
                }
            }
        }

        // Create a quick access array for towers.
        this.Towers = [];
        if (this.mem.structures && this.mem.structures.towers) {
            for (let towerId of this.mem.structures.towers) {
                let tower = Game.getObjectById(towerId);
                if (tower) {
                    this.Towers.push(tower);
                }
            }
            if (this.Towers.length > 1) {
                this.Towers.sort(function(a, b) { return a.energy - b.energy });
            }
        }

        // Create a quick access property for the real or temporary storage.
        this.Storage = null;
        if (this.room.storage) {
            this.Storage = this.room.storage;
        }
        else if (this.mem.structures.tempstorage) {
            let tempStorage = Game.getObjectById(this.mem.structures.tempstorage);
            if (tempStorage) {
                this.Storage =  tempStorage;
            }
        }
        else if (this.mem.tempstorage) {
            let tempStorage = Game.getObjectById(this.mem.tempstorage);
            if (tempStorage) {
                this.Storage =  tempStorage;
            }
        }

        // Create a quick access array of all the room links.
        this.Links = {};
        this.Links.Controller = null;
        this.Links.Storage = null;
        this.Links.Inputs = [];
        if (this.mem.structures && this.mem.structures.links) {
            if (this.mem.structures.links.controller) {
                let controllerLink = Game.getObjectById(this.mem.structures.links.controller);
                if (controllerLink) {
                    this.Links.Controller = controllerLink;
                }
            }
            if (this.mem.structures.links.storage) {
                let storageLink = Game.getObjectById(this.mem.structures.links.storage);
                if (storageLink) {
                    this.Links.Storage = storageLink;
                }
            }
            if (this.mem.structures.links.inputs) {
                for (let linkId of this.mem.structures.links.inputs) {
                    let inputLink = Game.getObjectById(linkId);
                    if (inputLink) {
                        this.Links.Inputs.push(inputLink);
                    }
                }
            }
        }

        let hostileCreeps = this.room.find(FIND_HOSTILE_CREEPS);
        if (hostileCreeps.length > 0) {
            this.mem.state = C.ROOM_STATE_INVADED;
        }
        else {
            this.mem.state = C.ROOM_STATE_NORMAL;
        }

        this.room.memory.jobs = { 
            settlers: 0,
            builders: 0,
            upgraders: 0,
            haulers: 0,
            miners: 0,
            refuelers: 0
        };

        this.room.memory.jobs.miners = this.mem.resources.sources.length;

        if (this.room.controller && this.room.controller.reservation) {
            if (this.room.controller.reservation.username === C.USERNAME && this.room.controller.reservation.ticksToEnd < 4000){
                this.room.memory.jobs.settlers = 1;
            }
        }
        
        if (this.Storage) {
            this.room.memory.jobs.refuelers = 2;
        }

        let wallCount = this.room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_WALL }).length;
        if (wallCount > 0) {
            if (this.mem.wallcount > wallCount) {
                if (this.room.controller && this.room.controller.my && !this.room.controller.safeMode) {
                    let hostiles = this.room.find(FIND_HOSTILE_CREEPS).length;
                    if (hostiles > 1) {
                        this.room.controller.activateSafeMode();
                    }
                }
            }
            
            if (this.mem.wallcount < wallCount) {
                this.mem.wallcount = wallCount;
            }
        }        

        let rampCount = this.room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_RAMPART }).length;
        if (rampCount > 0) {
            if (this.mem.rampcount > rampCount) {
                if (this.room.controller && this.room.controller.my && !this.room.controller.safeMode) {
                    let hostiles = this.room.find(FIND_HOSTILE_CREEPS).length;
                    if (hostiles > 1) {
                        this.room.controller.activateSafeMode();
                    }
                }
            }
            
            if (this.mem.rampcount < rampCount) {
                this.mem.rampcount = rampCount;
            }
        }
    }

    /**
     * Perform an analysis of the room once every 50-60 ticks.
     */
    analyze() {
        if (this.mem.update.next >= Game.time) {
            return;
        }

        // Prepare next update.
        this.mem.update.next = Game.time + 50 + Math.floor(Math.random() * 10);
        this.mem.update.last = Game.time;

        // Storing resource information to memory.
        this.mem.resources = {};
        this.mem.resources.sources = [];
        for (let source of this.room.find(FIND_SOURCES)) {
            this.mem.resources.sources.push(source.id);
        }
        this.mem.resources.minerals = [];
        for (let mineral of this.room.find(FIND_MINERALS)) {
            this.mem.resources.minerals.push(mineral.id);
        }
        
        if (!this.mem.wallcount) {
            this.mem.wallcount = 0;
        }
        
        if (!this.mem.rampcount) {
            this.mem.rampcount = 0;
        }

        this.mem.structures = {};
        this.mem.structures.spawns = [];
        this.mem.structures.extensions = [];
        this.mem.structures.towers = [];
        this.mem.structures.containers = [];
        this.mem.structures.tempstorage = null;
        this.mem.structures.links = {};
        this.mem.structures.links.storage = null;
        this.mem.structures.links.controller = null;
        this.mem.structures.links.inputs = [];
        
        for (let structure of this.room.find(FIND_STRUCTURES)) {
            if (structure.structureType === STRUCTURE_SPAWN) {
                this.mem.structures.spawns.push(structure.id);
                this.mem.structures.extensions.push(structure.id);
            }

            if (structure.structureType === STRUCTURE_EXTENSION) {
                this.mem.structures.extensions.push(structure.id);
            }

            if (structure.structureType === STRUCTURE_TOWER) {
                this.mem.structures.towers.push(structure.id);
            }

            if (structure.structureType === STRUCTURE_CONTAINER) {
                if (!this.room.storage && structure.pos.findInRange(FIND_MY_SPAWNS, 1).length > 0) {
                    this.mem.structures.tempstorage = structure.id;
                }
                else {
                    this.mem.structures.containers.push(structure.id);
                }
            }

            if (structure.structureType === STRUCTURE_LINK) {
                let rangeToStorage = structure.pos.getRangeTo(this.room.storage);
                let rangeToController = structure.pos.getRangeTo(this.room.controller);

                if (Math.min(rangeToStorage, rangeToController) > 5) {
                    this.mem.structures.links.inputs.push(structure.id);
                }
                else if (rangeToController < rangeToStorage) {
                    this.mem.structures.links.controller = structure.id;
                }
                else {
                    this.mem.structures.links.storage = structure.id;
                }
            }
        }
    }
}

module.exports = RoomReal;
