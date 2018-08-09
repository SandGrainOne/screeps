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

    get Source() {
        if (this.mem.resourceid) {
            // Renew reservation.
            if (this.Room.reserveTarget(this.mem.resourceid, this.Name)) {
                return Game.getObjectById(this.mem.resourceid);
            }
        }
        for (let source of this.Room.Sources) {
            if (this.Room.reserveTarget(source.id, this.Name)) {
                this.mem.resourceid = source.id;
                return source;
            }
        }
        return null;
    }
    
    /**
     * Perform mining related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        let workParts = this.creep.getActiveBodyparts(WORK);
        let standsOnContainer = false;

        if (this.Energy > 0) {
            let foundStructures = this.creep.pos.lookFor(LOOK_STRUCTURES);
            if (foundStructures.length > 0) {
                for (let structure of foundStructures) {
                    if (structure.structureType === STRUCTURE_CONTAINER) {
                        if (structure.hits < structure.hitsMax) {
                            let repairResult = this.creep.repair(structure);
                            if (repairResult === OK) {
                                this.Energy = Math.max(0, this.Energy - workParts);
                                this.Carry = Math.max(0, this.Carry - workParts);
                                break;
                            }
                        }
                        standsOnContainer = true;
                    }
                }
            }
            if (!standsOnContainer) {
                let foundSites = this.creep.pos.lookFor(LOOK_CONSTRUCTION_SITES);
                if (foundSites.length > 0) {
                    // There can only ever be one construction site in a single space.
                    // The miner should only help with the construction of a container.
                    if (foundSites[0].structureType === STRUCTURE_CONTAINER) {
                        let buildResult = this.creep.build(foundSites[0]);
                        if (buildResult === OK) {
                            this.Energy = Math.max(0, this.Energy - workParts * 5)
                            this.Carry = Math.max(0, this.Carry - workParts * 5)
                        }
                    }
                }
            }
        }

        if (this.Carry <= this.creep.carryCapacity) {
            let source = this.Source;
            if (source && this.creep.pos.isNearTo(source)) {
                let harvestResult = this.creep.harvest(source);
                if (harvestResult === OK) {
                    this.Energy = Math.min(this.creep.carryCapacity, this.Energy + workParts * 2);
                    this.Carry = Math.min(this.creep.carryCapacity, this.Carry + workParts * 2);
                }
            }
        }

        if (standsOnContainer && this.Carry >= this.creep.carryCapacity - workParts * 2) {
            for (let resourceType in this.creep.carry) {
                let dropResult = this.creep.drop(resourceType);
                if (dropResult === OK) {
                    let amount = this.creep.carry[resourceType];
                    if (resourceType === RESOURCE_ENERGY) {
                        this.Energy = this.Energy - amount;
                    }
                    this.Carry = this.Carry - amount;
                }
            }
        }

        if (this.Carry >= this.creep.carryCapacity - workParts * 2) {
            for (let structure of this.creep.pos.findInRange(FIND_STRUCTURES, 1)) {
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

                if (structure.structureType === STRUCTURE_SPAWN || structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_LINK) {
                    let space = structure.energyCapacity - structure.energy;
                    if (this.creep.transfer(structure, RESOURCE_ENERGY) === OK) {
                        let transfered = Math.min(space, this.Energy);
                        this.Energy = this.Energy - transfered;
                        this.Carry = this.Carry - transfered;
                    }
                }
            }
        }

        if (this.Carry <= 0) {
            this.IsWorking = true;
        }

        if (this.Carry >= this.creep.carryCapacity) {
            this.IsWorking = false;
        }

        if (this.IsWorking) {
            // Find and move to a place to mine.
            if (!this.AtWork) {
                this.moveToRoom(this.WorkRoom);
            }
            else {
                let source = this.Source;
                if (source) {
                    if (!this.creep.pos.isNearTo(source)) {
                        this.moveTo(source);
                    }
                }
                else {
                    this.creep.say("node!?");
                }
            }
        }
        else {
            if (!this.AtHome) {
                this.moveToRoom(this.HomeRoom);
            }
            else {
                if (this.Room.Storage) {
                    this.moveTo(this.Room.Storage);
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
        }

        return true;
    }
}

module.exports = CreepMiner;
