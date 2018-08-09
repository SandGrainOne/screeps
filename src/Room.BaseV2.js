'use strict';

let C = require('constants');

let RoomBase = require('Room.Base');

/**
 * Wrapper class with basic logic for rooms.
 */
class RoomBaseV2 extends RoomBase {
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

    get Storage() {
        if (this.room.storage) {
            return this.room.storage;
        }
        if (this.mem.tempstorage) {
            return Game.getObjectById(this.mem.tempstorage);
        }
        return null;
    }

    getContainers() {
        let containers = [];
        for (let container of this.mem.containers){
            containers.push(Game.getObjectById(container.id));
        }
        return containers;
    }

    getSendingLinks() {
        let links = [];
        for (let link of this.mem.linksend){
            links.push(Game.getObjectById(link.id));
        }
        return links;
    }

    getReceivingLinks() {
        let links = [];
        for (let link of this.mem.linkreceive){
            links.push(Game.getObjectById(link.id));
        }
        return links;
    }

    getSourceNode(creepName) {
        let sources = this.mem.resources.sources;
        for (let source of sources) {
            if (source.miner === creepName) {
                return { id: source.id, pos: source.pos };
            }
        }
        for (let source of sources) {
            if (!source.miner) {
                source.miner = creepName;
                return { id: source.id, pos: source.pos };
            }
        }
        return null;
    }

    update() {
        // Perform an analysis of the room every 50-60 ticks.
        this.analyze();

        // Remove miners that are dead.
        if (this.mem.resources.sources.length > 0) {
            for (let source of this.mem.resources.sources) {
                if (source.miner && !Game.creeps[source.miner]) {
                    source.miner = null;
                }
            }
        }

        this.Links = {};
        this.Links.Controller = Game.getObjectById(this.mem.structures.links.controller);
        this.Links.Storage = Game.getObjectById(this.mem.structures.links.storage);
        this.Links.Inputs = [];
        for (let linkId of this.mem.structures.links.inputs) {
            this.Links.Inputs.push(Game.getObjectById(linkId));
        }

        this.Sources = [];
        for (let sourceId of this.mem.resources.sources) {
            this.Sources.push(Game.getObjectById(sourceId.id));
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
            this.room.memory.jobs.refuelers = 1;
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

        if (this.room.controller && this.room.controller.my) {
            this.mem.type = C.ROOM_TYPE_OWNED;
        }

        // Resources are permanent structures in the world. Don't update more than once.
        let resources = this.mem.resources;
        if (resources.refresh) {
            this.mem.resources.sources = [];
            for (let source of this.room.find(FIND_SOURCES)) {
                resources.sources.push({ id: source.id, pos: source.pos, miner: null });
            }
            this.mem.resources.minerals = [];
            for (let mineral of this.room.find(FIND_MINERALS)) {
                resources.minerals.push({ id: mineral.id, pos: mineral.pos, miner: null });
            }
            resources.refresh = false;
        }
        
        if (!this.mem.wallcount) {
            this.mem.wallcount = 0;
        }
        
        if (!this.mem.rampcount) {
            this.mem.rampcount = 0;
        }

        let linkSend = [];
        this.mem.linksend = linkSend;
        let linkReceive = [];
        this.mem.linkreceive = linkReceive;
        let containers = [];
        this.mem.containers = containers;
        this.mem.structures.links.inputs = [];

        let roomStructures = this.room.find(FIND_STRUCTURES);
        for (let structure of roomStructures) {
            //if (this.Name === "E77N85") { console.log(structure.structureType); }
            if (structure.structureType === STRUCTURE_LINK) {
                let rangeToStorage = structure.pos.getRangeTo(this.room.storage);
                let rangeToController = structure.pos.getRangeTo(this.room.controller);

                if (Math.min(rangeToStorage, rangeToController) > 5) {
                    linkSend.push({ id: structure.id });
                    this.mem.structures.links.inputs.push(structure.id);
                }
                else {
                    linkReceive.push({ id: structure.id });
                    if (rangeToController < rangeToStorage) {
                        this.mem.structures.links.controller = structure.id;
                    }
                    else {
                        this.mem.structures.links.storage = structure.id;
                    }
                }
            }
            
            if (structure.structureType === STRUCTURE_CONTAINER) {
                if (!this.room.storage && structure.pos.findInRange(FIND_SOURCES, 2).length <= 0) {
                    this.mem.tempstorage = structure.id;
                }
                else {
                    containers.push({ id: structure.id, pos: structure.pos });
                }
            }
        }
    }
}

module.exports = RoomBaseV2;
