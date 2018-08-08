'use strict';

let CreepWorker = require('Creep.Worker');

/**
 * Wrapper class for creeps with logic for a miner.
 */
class CreepMiner extends CreepWorker {   
    /**
     * Initializes a new instance of the CreepMiner class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep) {
        super(creep);
    }

    get isParked() {
        if (!this.getMem("isParked")) {
            if (!this.creep.pos.isNearTo(this.getSource())) {
                return false;
            }
            
            for (let obj of this.creep.pos.look()) {
                if ( obj.type === "structure") {
                    if (obj.structure.structureType === "container") {
                        this.setMem("isParked", true);
                        return true;
                    }
                }
            }
        }

        return !!this.getMem("isParked");
    }
    
    /**
     * Perform mining related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        //if (this.isParked) {
        //    this.creep.harvest(this.getSource());
        //    this.creep.drop(RESOURCE_ENERGY);
        //    return true;
        //}

        if (this.creep.carry.energy < this.creep.carryCapacity) {
            if (this.moveOut()) {
                let source = this.getSource();
                
                if (source !== null) {
                    if (this.creep.harvest(source) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(source);
                    }
                }
            }
        }
        else {
            if (this.moveHome()) {
                let container = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: function (s) { 
                        return (s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < s.storeCapacity) || 
                               (s.structureType === STRUCTURE_LINK && s.energy < s.energyCapacity); 
                    } 
                });
                
                if (container != undefined) {
                    if (this.creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(container);
                    }
                    return true;
                }

                let spawn = this.creep.pos.findClosestByPath(FIND_MY_SPAWNS, { 
                    filter: function (s) { 
                        return s.structureType === STRUCTURE_EXTENSION && (s.energy < s.energyCapacity); 
                    } 
                });
                
                if (spawn !== null) {
                    if (this.creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(spawn);
                    }
                    return true;
                }

                let extension = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                    filter: function (s) { 
                        return s.structureType === STRUCTURE_EXTENSION && (s.energy < s.energyCapacity); 
                    } 
                });

                if (extension != undefined) {
                    if (this.creep.transfer(extension, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(extension);
                    }
                    return true;
                }
            }
        }

        return true;
    }
    
    /**
     * Perform miner specific retirement logic. 
     * A miner at less than a low number of ticks left to live will unassign themself from a room mining node, but continue to mine.
     * 
     * @returns {Boolean} Always false.
     */
    retire() {
        if (this.creep.ticksToLive <= 5) {
            this.Room.removeMiner(this.creep.name);
        }

        return false; 
    }
    
    /**
     * Get the source reserved by this miner. If no source has been reserved, then attempt to reserve one.
     * 
     * @returns {Source} The source that the miner has reserved if available.
     */
    getSource()
    {
        if (this.getMem("source") === null) {
            this.setMem("source", this.Room.getMiningNode(this.creep.name));
        }

        return Game.getObjectById(this.getMem("source").id);
    }
}

module.exports = CreepMiner;
