'use strict';

let CreepWorker = require('Creep.Worker');

/**
 * Wrapper class for creeps with logic for a miner.
 * Primary purpose of these creeps are to harvest energy or minerals.
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
    
    /**
     * Perform mining related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        let energy = this.creep.carry.energy;

        if (energy > this.creep.carryCapacity - 20) {
            let target = null;
            for (let structure of this.creep.pos.lookFor(LOOK_STRUCTURES)) {
                if (structure.hits <= structure.hitsMax - structure.hitsMax / 10) {

                }
            }
        }

        let source = this.getSource();
        
        //let harvestResult;

        if (source) {
            let harvestResult = this.creep.harvest(null);
            //console.log(harvestResult);
            let deposit = source.pos.findInRange(FIND_STRUCTURES, 1);
        }

        if (this.creep.carry.energy < this.creep.carryCapacity - 25) {
            if (this.moveOut()) {

                let mysource = this.getSource();
                let crates = mysource.pos.findInRange(FIND_STRUCTURES, 1, { filter: (c) => c.structureType === STRUCTURE_CONTAINER});

                if (mysource && crates.length > 0 && this.creep.pos.isEqualTo(crates[0])) {
                    this.creep.harvest(mysource);
                    
                    this.creep.transfer(crates[0], RESOURCE_ENERGY);
            
                    let structs = this.creep.pos.lookFor(LOOK_STRUCTURES);
                    for (let struct of structs) {
                        if (struct.hits < struct.hitsMax) {
                            this.creep.repair(struct);
                        }
                    }
                    return true;
                }
                
                if (this.creep.harvest(mysource) === ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(mysource);
                    return true;
                }
            }
        }
        else {
            let sites = this.creep.pos.lookFor(LOOK_CONSTRUCTION_SITES);
            if (sites.length > 0) {
                this.creep.build(sites[0]);
                return true;
            }
            
            let structs = this.creep.pos.lookFor(LOOK_STRUCTURES);
            for (let struct of structs) {
                if (struct.hits < struct.hitsMax) {
                    this.creep.repair(struct);
                }
            }
            
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
     * Get the source reserved by this miner. If no source has been reserved, then attempt to reserve one.
     * 
     * @returns {Source} The source that the miner has reserved if available.
     */
    getSource() {
        if (!this.mem.source) {
            let source = this.WorkRoom.getMiningNode(this.Name);
            if (source) {
                this.mem.source = source;
            }
            else {
                return null;
            }
        }
        return Game.getObjectById(this.mem.source);
    }
}

module.exports = CreepMiner;
