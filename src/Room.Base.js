'use strict';

let C = require('constants');

/**
 * Wrapper class with basic logic for rooms.
 */
class RoomBase {
    /**
     * Initializes a new instance of the RoomBase class with the specified room.
     * 
     * @param {Room} room - The room to be wrapped.
     */
    constructor(room) {
        this.room = room;
    }

    /**
     * Gets the name of the room.
     */
    get Name() {
        return this.room.name;
    }

    /**
     * Gets the state of the room.
     */
    get State() {
        return this.getMem("state");
    }

    /**
     * Sets the state of the room.
     */
    set State(value) {
        return this.setMem("state", value);
    }

    getSendingLinks() {
        let links = [];
        for (let link of this.getMem("linksend")){
            links.push(Game.getObjectById(link.id));
        }
        return links;
    }

    getReceivingLinks() {
        let links = [];
        for (let link of this.getMem("linkreceive")){
            links.push(Game.getObjectById(link.id));
        }
        return links;
    }

    getMiningNode(creepName) {
        if (!this.getMem("sources")) {
            return null;
        }
        
        for (let source of this.getMem("sources")) {
            if (source.miner === creepName) {
                return source.id;
            }
        }

        for (let source of this.getMem("sources")) {
            if (!source.miner || !source.miner) {
                source.miner = creepName;
                return source.id;
            }
        }

        return null;
    }

    update() {
        // Perform an analysis of the room every 50-60 ticks.
        this.analyze();

        // Remove miners that are dead.
        if (this.getMem("sources")) {
            for (let source of this.getMem("sources")) {
                if (source.miner && !Game.creeps[source.miner]) {
                    source.miner = null;
                }
            }
        }

        let hostileCreeps = this.room.find(FIND_HOSTILE_CREEPS);
        if (hostileCreeps.length > 0) {
            this.State = "invaded";
        }
        else {
            this.State = "normal";
        }

        this.room.memory.jobs = { 
            settlers: 0,
            builders: 0,
            upgraders: 0,
            haulers: 0,
            miners: 0
        };

        this.room.memory.jobs.miners = this.getMem("sources") ? this.getMem("sources").length : 0;

        if (this.room.controller && this.room.controller.reservation) {
            if (this.room.controller.reservation.username === C.USERNAME && this.room.controller.reservation.ticksToEnd < 4000){
                this.room.memory.jobs.settlers = 1;
            }
        }

        let wallCount = this.room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_WALL }).length;
        if (wallCount > 0) {
            if (this.getMem("wallcount") > wallCount) {
                if (this.room.controller && this.room.controller.my && !this.room.controller.safeMode) {
                    let hostiles = this.room.find(FIND_HOSTILE_CREEPS).length;
                    if (hostiles > 1) {
                        this.room.controller.activateSafeMode();
                    }
                }
            }
            
            if (this.getMem("wallcount") < wallCount) {
                this.setMem("wallcount", wallCount);
            }
        }        

        let rampCount = this.room.find(FIND_STRUCTURES, { filter: (s) => s.structureType === STRUCTURE_RAMPART }).length;
        if (rampCount > 0) {
            if (this.getMem("rampcount") > rampCount) {
                if (this.room.controller && this.room.controller.my && !this.room.controller.safeMode) {
                    let hostiles = this.room.find(FIND_HOSTILE_CREEPS).length;
                    if (hostiles > 1) {
                        this.room.controller.activateSafeMode();
                    }
                }
            }
            
            if (this.getMem("rampcount") < rampCount) {
                this.setMem("rampcount", rampCount);
            }
        }
    }

    /**
     * Perform an analysis of the room once every 50-60 ticks.
     */
    analyze() {
        if (this.getMem("nextupdate") >= Game.time) {
            return;
        }

        this.setMem("nextupdate", Game.time + 50 + Math.floor(Math.random() * 10));
        this.setMem("lastupdate", Game.time);

        if (!this.getMem("sources")) {
            let sources = [];
            for (let source of this.room.find(FIND_SOURCES)) {
                sources.push({ id: source.id, miner: null, hauler: null });
            }
            this.setMem("sources", sources);
        }
        
        if (!this.getMem("wallcount")) {
            this.setMem("wallcount", 0);
        }
        
        if (!this.getMem("rampcount")) {
            this.setMem("rampcount", 0);
        }

        let linkSend = [];
        this.setMem("linksend", linkSend);
        let linkReceive = [];
        this.setMem("linkreceive", linkReceive);

        let roomStructures = this.room.find(FIND_STRUCTURES);
        for (let structure of roomStructures) {
            if (structure.structureType === STRUCTURE_LINK) {
                let rangeToStorage = structure.pos.getRangeTo(this.room.storage);
                let rangeToController = structure.pos.getRangeTo(this.room.controller);

                if (Math.min(rangeToStorage, rangeToController) > 5) {
                    linkSend.push({ id: structure.id });
                }
                else {
                    linkReceive.push({ id: structure.id });
                }
            }
        }
    }

    /**
     * Get something from the room memory. 
     * 
     * @returns {object} The value stored under the given key. null if not found.
     */
    getMem(key) {
        if (typeof this.room.memory[key] != 'undefined') {
            return this.room.memory[key];
        }
        return null;
    }

    /**
     * Store a value to the room memory under the given key.
     * 
     * @param {string} key - The key assigned to the storage.
     * @param {value} value - The value to be stored under the key.
     */
    setMem(key, value) {
        if (this.room.memory[key] !== value) {
            this.room.memory[key] = value;
        }
    }
}

module.exports = RoomBase;
