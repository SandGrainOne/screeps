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
        if (this.Room.Resources.Sources.length > 0) {
            for (let source of this.Room.Resources.Sources) {
                if (this.Room.reserveTarget(source.id, this.Name)) {
                    this.mem.resourceid = source.id;
                    return source;
                }
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
        let standsOnContainer = false;
        let performedWork = false;

        if (this.AtWork && this.StartEnergy > Math.min(this.Strength * 5, this.Capacity)) {
            let foundStructures = this.creep.pos.lookFor(LOOK_STRUCTURES);
            if (foundStructures.length > 0) {
                for (let structure of foundStructures) {
                    if (structure.structureType === STRUCTURE_CONTAINER) {
                        standsOnContainer = true;
                        if (structure.hits < structure.hitsMax) {
                            if (this.repair(structure) === OK) {
                                performedWork = true;
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
                    // The miner should only help with the construction of a container.
                    if (foundSites[0].structureType === STRUCTURE_CONTAINER) {
                        if (this.build(foundSites[0]) === OK) {
                            performedWork = true;
                        }
                    }
                }
            }
        }

        // The creep can't both repair/build and harvest in the same tick.
        if (!performedWork && this.AtWork && this.EndCarry <= this.Capacity) {
            let source = this.Source;
            if (source && this.creep.pos.isNearTo(source)) {
                this.harvest(source);
            }
        }

        if (this.EndCarry >= this.Capacity) {
            if (standsOnContainer) {
                for (let resourceType in this.creep.carry) {
                    if (this.creep.carry[resourceType] <= 0) {
                        continue;
                    }
                    if (this.drop(resourceType) === OK) {
                        break;
                    }
                }
            }
            else if (this.AtHome) {
                if (this.Room.Containers.length > 0) {
                    let containers = this.creep.pos.findInRange(this.Room.Containers, 1);
                    if (containers.length > 0) {
                        let space = containers[0].storeCapacity - _.sum(containers[0].store);
                        for (let resourceType in this.creep.carry) {
                            if (this.transfer(containers[0], resourceType) === OK) {
                                break;
                            }
                        }
                    }
                }

                let links = this.creep.pos.findInRange(this.Room.Links.Inputs, 1);
                if (links.length > 0) {
                    let space = links[0].energyCapacity - links[0].energy;
                    if (this.transfer(links[0], RESOURCE_ENERGY) === OK) {
                        let transfered = Math.min(space, this.StartEnergy);
                    }
                }

                let storage = this.Room.Storage;
                if (storage && this.creep.pos.isNearTo(storage)) {
                    let space = storage.storeCapacity - _.sum(storage.store);
                    for (let resourceType in this.creep.carry) {
                        if (this.transfer(storage, resourceType) === OK) {
                            break;
                        }
                    }
                }
            }
        }

        if (this.Name === " ") {
            console.log("StartCarry: " + this.StartCarry);
            console.log("EndCarry  : " + this.EndCarry);
        }

        let moveTarget = null;

        if (this.EndCarry < this.Capacity) {
            if (!this.AtWork) {
                this.moveToRoom(this.WorkRoom);
            }
            else {
                let source = this.Source;
                if (source) {
                    if (!this.creep.pos.isNearTo(source)) {
                        moveTarget = source;
                    }
                    else if (!standsOnContainer && this.Room.Containers.length > 0){
                        // Need to reposition to on top of the container.
                        let containers = source.pos.findInRange(this.Room.Containers, 1);
                        if (containers.length === 1) {
                            moveTarget = containers[0];
                        }
                        else if (containers.length > 1) {
                            // TODO: See room E78N62
                        }
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
                    moveTarget = this.Room.Storage;
                }
                else {
                    // This should only happen early on before there is a temporary or real storage.
                    // The this.Extensions array only holds extensions with available space.
                    let extension = this.creep.pos.findClosestByRange(this.Extensions);
                    if (extension) {
                        if (!this.creep.pos.isNearTo(extension)) {
                            moveTarget = extension;
                        }
                    }
                }
            }
        }

        if (moveTarget) {
            this.moveTo(moveTarget);
        }

        return true;
    }
}

module.exports = CreepMiner;
