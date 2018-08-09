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
        this.init();
    }
    
    /**
     * Perform mining related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        let workParts = this.creep.getActiveBodyparts(WORK);
        let standsOnContainer = false;

        if (this.AtWork) {
            if (this.Energy > 0) {
                let foundStructures = this.creep.pos.lookFor(LOOK_STRUCTURES);
                if (foundStructures.length > 0) {
                    for (let structure of foundStructures) {
                        if (structure.structureType === STRUCTURE_CONTAINER) {
                            standsOnContainer = true;
                            if (structure.hits < structure.hitsMax) {
                                if (this.creep.repair(structure) === OK) {
                                    this.Energy = Math.max(0, this.Energy - workParts);
                                    this.Carry = Math.max(0, this.Carry - workParts);
                                    break;
                                }
                            }
                        }
                    }
                }
                if (!standsOnContainer) {
                    let foundSites = this.creep.pos.lookFor(LOOK_CONSTRUCTION_SITES);
                    if (foundSites.length > 0) {
                        // There can only ever be one construction site in a single space.
                        // The miner will only help with the construction of a container.
                        if (foundSites[0].structureType === STRUCTURE_CONTAINER) {
                            if (this.creep.build(site) === OK) {
                                this.Energy = Math.max(0, this.Energy - workParts * 5)
                                this.Carry = Math.max(0, this.Carry - workParts * 5)
                            }
                        }
                    }
                }
            }

            if (this.Energy <= this.creep.carryCapacity) {
                let source = this.getSourceNode();
                if (source && this.creep.pos.isNearTo(source)) {
                    let harvestResult = this.creep.harvest(source);
                    if (harvestResult === OK) {
                        this.Energy = Math.min(this.creep.carryCapacity, this.Energy + workParts * 2);
                        this.Carry = Math.min(this.creep.carryCapacity, this.Carry + workParts * 2);
                    }
                }
            }
        }

        if (this.Carry >= this.creep.carryCapacity - workParts * 2) {
            if (standsOnContainer) {
                for(let resourceType in this.creep.carry) {
                    if (this.creep.drop(resourceType) === OK) {
                        let amount = this.creep.carry[resourceType];
                        if (resourceType === RESOURCE_ENERGY) {
                            this.Energy = this.Energy - amount;
                        }
                        this.Carry = this.Carry - amount;
                    }
                }
            }
            
            if (!standsOnContainer) {
                for (let structure of this.creep.pos.findInRange(FIND_STRUCTURES, 1)) {
                    // if link

                    if (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE) {
                        let space = structure.storeCapacity - _.sum(structure.store);
                        for (let resourceType in this.creep.carry) {
                            if (this.creep.transfer(structure, resourceType) === OK) {
                                let amount = this.creep.carry[resourceType];
                                let transfered = Math.min(space, amount);
                                if (resourceType === RESOURCE_ENERGY) {
                                    this.Energy = this.Energy - transfered;
                                }
                                this.Carry = this.Carry - transfered;
                            }
                        }
                    }
                    if (structure.structureType === STRUCTURE_SPAWN) {
                        let space = structure.energyCapacity;
                        
                        if (this.creep.transfer(structure, RESOURCE_ENERGY) === OK) {
                            let transfered = Math.min(space, this.Energy);
                            this.Energy = this.Energy - transfered;
                            this.Carry = this.Carry - transfered;
                        }
                    }
                }
            }
        }

        // Perform movement
        if (this.Carry < this.creep.carryCapacity) {
            let source = this.getSourceNode();
            if (source) {
                if (!this.creep.pos.isNearTo(source)) {
                    this.moveTo(source);
                }
            }
            else {
                this.creep.say("node!?");
            }
        }

        if (!standsOnContainer && this.Carry >= this.creep.carryCapacity) {
            if (this.HomeRoom.Storage) {
                this.moveTo(this.HomeRoom.Storage);
            }
            else {
                let spawn = this.creep.pos.findClosestByPath(FIND_MY_SPAWNS);
                if (spawn) {
                    if (!this.creep.pos.isNearTo(spawn)) {
                     this.moveTo(spawn);
                    }
                }
            }
        }

        return true;
    }

    findMiningTarget() {

    }
    
    /**
     * Get the source reserved by this miner.
     * 
     * @returns {Source} The source that the miner has reserved if available.
     */
    getSourceNode() {
        if (!this.mem.source || !this.mem.source.id) {
            let source = this.WorkRoom.getSourceNode(this.Name);
            if (source) {
                this.mem.source = source;
            }
            else {
                return null;
            }
        }

        let realSource = Game.getObjectById(this.mem.source.id);
        if (realSource) {
            return realSource;
        }
        
        return new RoomPosition(this.mem.source.pos.x, this.mem.source.pos.y, this.mem.source.pos.roomName);
    }

    init() {
        let miningTarget;
    }
}

module.exports = CreepMiner;
