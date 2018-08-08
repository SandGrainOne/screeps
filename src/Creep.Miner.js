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
        this.activity = "mining";
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
        if (this.isParked) {
            this.creep.harvest(this.getSource());
            this.creep.drop(RESOURCE_ENERGY);            
            return true;
        }

        if (this.creep.carry.energy < this.creep.carryCapacity) {
            let source = this.getSource();
            
            if (source !== null) {
                if (this.creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(source);
                }
            }
        }
        else {
            let container = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                filter: function (object) { 
                    return object.structureType === STRUCTURE_CONTAINER && (object.store.energy < object.storeCapacity); 
                } 
            });
            
            if (container != undefined) {
                if (this.creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(container);
                }
            }
            else {
                let spawn = this.creep.pos.findClosestByPath(FIND_MY_SPAWNS);
                
                if (spawn !== null && spawn.energy < spawn.energyCapacity) {
                    if (this.creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(spawn);
                    }
                }
                else {
                    let extension = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                        filter: function (object) { 
                            return object.structureType === STRUCTURE_EXTENSION && (object.energy < object.energyCapacity); 
                        } 
                    });

                    if (extension != undefined) {
                        if (this.creep.transfer(extension, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            this.creep.moveTo(extension);
                        }
                    }
                    else {
                        let tower = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                            filter: function (object) { 
                                return object.structureType === STRUCTURE_TOWER && (object.energy < object.energyCapacity); 
                            } 
                        });

                        if (tower != undefined) {
                            if (this.creep.transfer(tower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                                this.creep.moveTo(tower);
                            }
                        }
                        else {
                            let storage = this.creep.room.storage;
                            
                            if (storage !== undefined) {
                                if (this.creep.pos.isNearTo(storage)) {
                                    this.creep.transfer(storage, RESOURCE_ENERGY);
                                }
                                else {
                                    this.creep.moveTo(storage);
                                }
                            }
                            else {
                                if (spawn !== null && !this.creep.pos.inRangeTo(spawn, 2)) {
                                    this.creep.moveTo(spawn);
                                }
                            }
                        }
                    }
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
            this.getRoom().removeMiner(this.creep.name);
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
            this.setMem("source", this.getRoom().getMiningNode(this.creep.name));
        }

        return Game.getObjectById(this.getMem("source").sourceId);
    }
}

module.exports = CreepMiner;
