'use strict';

let C = require('constants');

/**
 * Wrapper class with logic for a room owned by the player.
 */
class RoomOwned {
    /**
     * Initializes a new instance of the RoomOwned class with the specified room.
     * 
     * @param {Room} room - The room to be wrapped.
     */
    constructor(room, creeps) {
        super(room);
        this.creeps = creeps;
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

    orderCreeps() {
        let roomSpawn = this.room.find(FIND_MY_SPAWNS)[0];
        
        if (roomSpawn.spawning || this.room.energyAvailable < 1200) {
            return;
        }
        
        if (count(this.creeps.miners) < 2) {
            roomSpawn.createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, MOVE], null, { job: "miner", remoteroom: this.Name, homeroom: this.Name });
            return;
        }
        
        if (count(this.creeps.haulers) < 3) {
            roomSpawn.createCreep([WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, { job: "hauler", remoteroom: this.Name, homeroom: this.Name });
            return;
        }
        
        if (count(this.creeps.upgraders) < 3) {
            roomSpawn.createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], null, { job: "upgrader", remoteroom: this.Name, homeroom: this.Name });
            return;
        }

        if (count(this.creeps.builders) < 2) {
            roomSpawn.createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], null, { job: "builder", remoteroom: this.Name, homeroom: this.Name });
            return;
        }
    }

    getMiningNode(creepName) {
        if (!this.getMem("sources")) {
            return null;
        }
        
        for (let source of this.getMem("sources")) {
            if (source.miner === creepName) {
                return source;
            }
        }

        for (let source of this.getMem("sources")) {
            if (source.miner === undefined || source.miner === null) {
                source.miner = creepName;
                return source;
            }
        }

        return null;
    }

    update() {
        if (this.getMem("nextupdate") < Game.time) {
            this.setMem("nextupdate", Game.time + 50 + Math.floor(Math.random() * 10));
            this.setMem("lastupdate", Game.time);

            this.analyze();
        }

        // Remove miners that are dead.
        if (this.getMem("sources")) {
            for (let source of this.getMem("sources")) {
                if (source.miner && !Game.creeps[source.miner]) {
                    source.miner = null;
                }
            }
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
            //console.log(this.getMem("wallcount") + " > " + wallCount + ": " + (this.getMem("wallcount") > wallCount));
            if (this.getMem("wallcount") > wallCount) {
                if (this.room.controller && this.room.controller.my && !this.room.controller.safeMode) {
                    let hostiles = this.room.find(FIND_HOSTILE_CREEPS).length;
                    console.log(hostiles);
                    if (hostiles > 1) {
                        this.room.controller.activateSafeMode();
                    }
                }
            }
            
            if (this.getMem("wallcount") < wallCount) {
                this.setMem("wallcount", wallCount);
            }
        }
    }

    analyze() {
        // Identifying sources in a room should only need to run once, ever.
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

        let linkSend = [];
        this.setMem("linksend", linkSend);
        let linkReceive = [];
        this.setMem("linkreceive", linkReceive);

        let roomStructures = this.room.find(FIND_MY_STRUCTURES);
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

    count(list) {
        return (!list ? 0 : list.length)
    }
}

module.exports = RoomBase;
