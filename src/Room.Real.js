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
        this._visible = true;
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
        if (!this._mem.reservations[targetId]) {
            this._mem.reservations[targetId] = { creepName: creepName, ttl: 2 };
            return true;
        }
        if (this._mem.reservations[targetId].creepName === creepName) {
            this._mem.reservations[targetId].ttl = 2;
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

        // Storing resource information to memory.
        this._mem.resources = {};
        this._mem.resources.sources = [];
        for (let source of this.room.find(FIND_SOURCES)) {
            this._mem.resources.sources.push(source.id);
        }
        this._mem.resources.minerals = null;
        this._mem.resources.extractor = null;
        let mineralNodes = this.room.find(FIND_MINERALS);
        if (mineralNodes.length > 0) {
            this._mem.resources.minerals = mineralNodes[0].id;
        }

        this._mem.structures = {};
        this._mem.structures.spawns = [];
        this._mem.structures.extensions = [];
        this._mem.structures.towers = [];
        this._mem.structures.containers = [];
        this._mem.structures.tempstorage = null;
        this._mem.structures.links = {};
        this._mem.structures.links.storage = null;
        this._mem.structures.links.controller = null;
        this._mem.structures.links.inputs = [];
        this._mem.structures.labs = {};
        this._mem.structures.labs.all = [];
        this._mem.structures.labs.rOne = null;
        this._mem.structures.labs.rTwo = null;
        this._mem.structures.labs.producers = [];

        // Need to handle Labs multiple times in order to identify the roles.
        let labs = [];

        for (let structure of this.room.find(FIND_STRUCTURES)) {

            if (structure.structureType === STRUCTURE_CONTAINER) {
                if (!this.room.storage && structure.pos.findInRange(FIND_MY_SPAWNS, 1).length > 0) {
                    this._mem.structures.tempstorage = structure.id;
                }
                else {
                    this._mem.structures.containers.push(structure.id);
                }
            }

            // Some rooms have public extractors
            if (structure.structureType === STRUCTURE_EXTRACTOR) {
                this._mem.resources.extractor = structure.id;
            }

            if (!this.room.controller || !this.room.controller.my) {
                continue;
            }

            if (structure.structureType === STRUCTURE_SPAWN) {
                this._mem.structures.spawns.push(structure.id);
                this._mem.structures.extensions.push(structure.id);
            }

            if (structure.structureType === STRUCTURE_EXTENSION) {
                this._mem.structures.extensions.push(structure.id);
            }

            if (structure.structureType === STRUCTURE_TOWER) {
                this._mem.structures.towers.push(structure.id);
            }

            if (structure.structureType === STRUCTURE_LINK) {
                let rangeToStorage = structure.pos.getRangeTo(this.room.storage);
                let rangeToController = structure.pos.getRangeTo(this.room.controller);

                if (Math.min(rangeToStorage, rangeToController) > 5) {
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

        if (this.name === "E77N85" && this.room.controller && this.room.controller.my) {
            if (labs.length === 3) {
                this._mem.structures.labs.rOne = labs[0].id;
                this._mem.structures.labs.rTwo = labs[1].id;
                this._mem.structures.labs.producers.push(labs[2].id);
            }
            else if (labs.length === 6) {
                labs.sort(function(a, b) { return _.sum(a.pos.x + a.pos.y * 10) - _.sum(b.pos.x + b.pos.y * 10) });
                this._mem.structures.labs.producers.push(labs[0].id);
                this._mem.structures.labs.producers.push(labs[1].id);
                this._mem.structures.labs.rOne = labs[2].id;
                this._mem.structures.labs.rTwo = labs[3].id;
                this._mem.structures.labs.producers.push(labs[4].id);
                this._mem.structures.labs.producers.push(labs[5].id);
            }
            else if (labs.length === 10) {
                labs.sort(function(a, b) { return _.sum(a.pos.x + a.pos.y * 10) - _.sum(b.pos.x + b.pos.y * 10) });
                this._mem.structures.labs.producers.push(labs[0].id);
                this._mem.structures.labs.producers.push(labs[1].id);
                this._mem.structures.labs.producers.push(labs[2].id);
                this._mem.structures.labs.producers.push(labs[3].id);
                this._mem.structures.labs.rOne = labs[4].id;
                this._mem.structures.labs.rTwo = labs[5].id;
                this._mem.structures.labs.producers.push(labs[6].id);
                this._mem.structures.labs.producers.push(labs[7].id);
                this._mem.structures.labs.producers.push(labs[8].id);
                this._mem.structures.labs.producers.push(labs[9].id);
            }
        }
    }

    tickReservations() {
        for (let targetId in this._mem.reservations) {
            this._mem.reservations[targetId].ttl = this._mem.reservations[targetId].ttl - 1;
            if (this._mem.reservations[targetId].ttl === 0) {
                delete this._mem.reservations[targetId];
            }
        }
    }

    prepare() {
        this.Resources = {};
        this.Resources.Sources = [];
        if (this._mem.resources) {
            if (this._mem.resources.sources) {
                for (let sourceId of this._mem.resources.sources) {
                    let source = Game.getObjectById(sourceId);
                    if (source) {
                        this.Resources.Sources.push(source);
                    }
                }
            }
            if (this._mem.resources.minerals && this._mem.resources.extractor) {
                let mineralNode = Game.getObjectById(this._mem.resources.minerals);
                let extractor = Game.getObjectById(this._mem.resources.extractor);
                if (mineralNode && mineralNode.mineralAmount > 0 && extractor) {
                    this.Resources.Minerals = mineralNode;
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
        if (this._mem.structures && this._mem.structures.containers) {
            for (let containerId of this._mem.structures.containers) {
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

        // Create a quick access property for the real or temporary storage.
        this.Storage = null;
        if (this.room.storage) {
            this.Storage = this.room.storage;
        }
        else if (this._mem.structures.tempstorage) {
            let tempStorage = Game.getObjectById(this._mem.structures.tempstorage);
            if (tempStorage) {
                this.Storage =  tempStorage;
            }
        }
        else if (this._mem.tempstorage) {
            let tempStorage = Game.getObjectById(this._mem.tempstorage);
            if (tempStorage) {
                this.Storage =  tempStorage;
            }
        }

        // Create a quick access array for towers.
        this.Towers = [];
        if (this._mem.structures && this._mem.structures.towers) {
            for (let towerId of this._mem.structures.towers) {
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
        this.Labs.All = [];
        this.Labs.Refuel = [];
        if (this._mem.structures.labs.all.length > 0) {
            for (let labId of this._mem.structures.labs.all) {
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
            this._mem.state = C.ROOM_STATE_INVADED;
        }
        else {
            this._mem.state = C.ROOM_STATE_NORMAL;
        }

        this._mem.jobs = { 
            settlers: 0,
            builders: 0,
            upgraders: 0,
            haulers: 0,
            miners: 0,
            mineralminers: 0,
            refuelers: 0
        };

        this._mem.jobs.miners = this._mem.resources.sources.length;

        if (this.Resources.Minerals) {
            this._mem.jobs.mineralminers = 1;
            this._mem.jobs.haulers = 1;
        }

        if (this.room.controller && this.room.controller.reservation) {
            if (this.room.controller.reservation.username === C.USERNAME && this.room.controller.reservation.ticksToEnd < 4000){
                this._mem.jobs.settlers = 1;
            }
        }

        if (this.Storage) {
            this._mem.jobs.refuelers = 2;
        }

        let wallCount = this.room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_WALL }).length;
        if (wallCount > 0) {
            if (this._mem.wallcount > wallCount) {
                if (this.room.controller && this.room.controller.my && !this.room.controller.safeMode) {
                    let hostiles = this.room.find(FIND_HOSTILE_CREEPS).length;
                    if (hostiles > 1) {
                        this.room.controller.activateSafeMode();
                    }
                }
            }
            
            if (this._mem.wallcount < wallCount) {
                this._mem.wallcount = wallCount;
            }
        }

        let rampCount = this.room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_RAMPART }).length;
        if (rampCount > 0) {
            if (this._mem.rampcount > rampCount) {
                if (this.room.controller && this.room.controller.my && !this.room.controller.safeMode) {
                    let hostiles = this.room.find(FIND_HOSTILE_CREEPS).length;
                    if (hostiles > 1) {
                        this.room.controller.activateSafeMode();
                    }
                }
            }

            if (this._mem.rampcount < rampCount) {
                this._mem.rampcount = rampCount;
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
                    return s.structureType === STRUCTURE_RAMPART && (s.hits < 400000);
                } 
            });

            if (rampartToRepair !== null) {
                tower.repair(rampartToRepair);
                continue;
            }

            let wallToRepair = tower.pos.findClosestByRange(FIND_STRUCTURES, { 
                filter: (wall) => { 
                    return wall.structureType === STRUCTURE_WALL && (wall.hits < 400000);
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

            for (let roomLink of roomLinks) {
                if (roomLink.energy < roomLink.energyCapacity / 2) {
                    let amount = Math.min(inputLink.energy, roomLink.energyCapacity - roomLink.energy)
                    let res = inputLink.transferEnergy(roomLink, amount);
                    break;
                }
            }
        }

        if (this.Links.Controller && this.Links.Storage) {
            let storageLink = this.Links.Storage;
            if (storageLink.cooldown === 0 && storageLink.energy > 0) {
                let controllerLink = this.Links.Controller;
                if (controllerLink.energy < controllerLink.energyCapacity / 2) {
                    let amount = Math.min(storageLink.energy, controllerLink.energyCapacity - controllerLink.energy)
                    let res = storageLink.transferEnergy(controllerLink, amount);
                }
            }
        }
    }
}

module.exports = RoomReal;
