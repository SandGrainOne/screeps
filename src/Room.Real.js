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
        this._visible = true;
        this.room = room;
    }

    get Controller() {
        if (this.room.controller) {
            return this.room.controller;
        }
        return null;
    }

    get Terminal() {
        if (this.room.terminal) {
            return this.room.terminal;
        }
        return null;
    }

    reserveTarget(targetId, creepName) {
        if (!this.mem.reservations[targetId]) {
            this.mem.reservations[targetId] = { creepName: creepName, ttl: 2 };
            return true;
        }
        if (this.mem.reservations[targetId].creepName === creepName) {
            this.mem.reservations[targetId].ttl = 2;
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
        if (!force && this.mem.update.next >= Game.time) {
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
        this.mem.resources.minerals = null;
        this.mem.resources.extractor = null;
        let mineralNodes = this.room.find(FIND_MINERALS);
        if (mineralNodes.length > 0) {
            this.mem.resources.minerals = mineralNodes[0].id;
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
        this.mem.structures.labs = {};
        this.mem.structures.labs.all = [];

        for (let structure of this.room.find(FIND_STRUCTURES)) {

            if (structure.structureType === STRUCTURE_CONTAINER) {
                if (!this.room.storage && structure.pos.findInRange(FIND_MY_SPAWNS, 1).length > 0) {
                    this.mem.structures.tempstorage = structure.id;
                }
                else {
                    this.mem.structures.containers.push(structure.id);
                }
            }

            if (!this.room.controller || !this.room.controller.my) {
                continue;
            }

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

            if (structure.structureType === STRUCTURE_EXTRACTOR) {
                this.mem.resources.extractor = structure.id;
            }

            if (structure.structureType === STRUCTURE_LAB) {
                this.mem.structures.labs.all.push(structure.id);
            }
        }
    }

    tickReservations() {
        for (let targetId in this.mem.reservations) {
            this.mem.reservations[targetId].ttl = this.mem.reservations[targetId].ttl - 1;
            if (this.mem.reservations[targetId].ttl === 0) {
                delete this.mem.reservations[targetId];
            }
        }
    }

    prepare() {
        this.Resources = {};
        this.Resources.Sources = [];
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
                let mineralNode = Game.getObjectById(this.mem.resources.minerals);
                if (mineralNode) {
                    this.Resources.Minerals = mineralNode;
                }
            }
            if (this.mem.resources.extractor) {
                let extractor = Game.getObjectById(this.mem.resources.extractor);
                if (extractor) {
                    this.Resources.Extractor = extractor;
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

        this.Labs = {};
        this.Labs.All = [];
        this.Labs.Refuel = [];
        if (this.mem.structures.labs.all.length > 0) {
            for (let labId of this.mem.structures.labs.all) {
                let lab = Game.getObjectById(labId);
                if (lab) {
                    this.Labs.All.push(lab);
                    if (lab.energy < lab.energyCapacity - 400) {
                        this.Labs.Refuel.push(lab);
                    }
                }
            }
        }

        this.BuildSites = [];
        let sites = this.room.find(FIND_CONSTRUCTION_SITES);
        if (sites.length > 0) {
            for (let site of sites) {
                this.BuildSites.push(site);
            }
        }

        this.Repairs = [];
        let structures = this.room.find(FIND_STRUCTURES);
        if (structures.length > 0) {
            for (let structure of structures) {
                if (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART) {
                    if (this.room.controller && this.room.controller.my) {
                        if (structure.hits < 150000) {
                            this.Repairs.push(structure);
                        }
                    }
                }
                else {
                    if (structure.hits < structure.hitsMax) {
                        this.Repairs.push(structure);
                    }
                }

                if (this.Repairs.length >= 5) {
                    break;
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

    defend() {
        if (this.Towers.length === 0) {
            return;
        }

        for (let tower of this.Towers) {

            let damagedCreeps = tower.room.find(FIND_MY_CREEPS, {
                filter: (creep) => {
                    return creep.hits < creep.hitsMax;
                }
            });

            if (damagedCreeps.length > 0) {
                tower.heal(damagedCreeps[0]);
                continue;
            }

            let hostiles = tower.room.find(FIND_HOSTILE_CREEPS);
            let hostileCreep = tower.pos.findClosestByRange(hostiles);

            if (hostileCreep !== null && hostileCreep.pos.y < 49) {
                tower.attack(hostileCreep);
                continue;
            }

            if (tower.energy < tower.energyCapacity - 200) {
                continue;
            }

            let rampartToRepair = tower.pos.findClosestByRange(FIND_STRUCTURES, { 
                filter: (s) => { 
                    return s.structureType === STRUCTURE_RAMPART && (s.hits < 250000);
                } 
            });

            if (rampartToRepair !== null) {
                tower.repair(rampartToRepair);
                continue;
            }

            let wallToRepair = tower.pos.findClosestByRange(FIND_STRUCTURES, { 
                filter: (wall) => { 
                    return wall.structureType === STRUCTURE_WALL && (wall.hits < 250000);
                } 
            });

            if (wallToRepair !== null) {
                tower.repair(wallToRepair);
                continue;
            } 

            let containerToRepair = tower.pos.findClosestByPath(FIND_STRUCTURES, { 
                filter: function (s) { 
                    return s.structureType === STRUCTURE_CONTAINER && (s.hits < s.hitsMax); 
                } 
            });

            if (containerToRepair !== null) {
                tower.repair(containerToRepair);
                continue;
            } 

            let roadToRepair = tower.pos.findClosestByPath(FIND_STRUCTURES, { 
                filter: function (road) { 
                    return road.structureType === STRUCTURE_ROAD && (road.hits < road.hitsMax); 
                } 
            });

            if (roadToRepair !== null) {
                tower.repair(roadToRepair);
                continue;
            }
        }
    }
}

module.exports = RoomReal;
