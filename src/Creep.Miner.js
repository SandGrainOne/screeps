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

    get ResourceNode() {
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
        //if (this.Room.Resources.Minerals) {
        //    if (this.Room.reserveTarget(this.Room.Resources.Minerals.id, this.Name)) {
        //        this.mem.resourceid = this.Room.Resources.Minerals.id;
        //        return this.Room.Resources.Minerals;
        //    }
        //}
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
        if (!performedWork && this.AtWork && this.NextCarry <= this.Capacity) {
            let resourceNode = this.ResourceNode;
            if (resourceNode && this.creep.pos.isNearTo(resourceNode)) {
                if (resourceNode.mineralType) {
                    if (this.Room.Resources.Extractor && this.Room.Resources.Extractor.cooldown <= 0) {
                        this.harvest(resourceNode);
                    }
                } 
                else {
                    this.harvest(resourceNode);
                }
            }
        }

        if (this.NextCarry >= this.Capacity) {
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
                        for (let resourceType in this.creep.carry) {
                            if (this.transfer(containers[0], resourceType) === OK) {
                                break;
                            }
                        }
                    }
                }

                if (this.Room.Links.Inputs.length > 0) {
                    let links = this.creep.pos.findInRange(this.Room.Links.Inputs, 1);
                    if (links.length > 0) {
                        this.transfer(links[0], RESOURCE_ENERGY);
                    }
                }

                let storage = this.Room.Storage;
                if (storage && this.creep.pos.isNearTo(storage)) {
                    for (let resourceType in this.creep.carry) {
                        if (this.transfer(storage, resourceType) === OK) {
                            break;
                        }
                    }
                }

                if (this.Room.Extensions.length > 0) {
                    let extensions = this.creep.pos.findInRange(this.Room.Extensions, 1);
                    if (extensions.length > 0) {
                        this.transfer(extensions[0], RESOURCE_ENERGY);
                    }
                }
            }
        }

        if (this.Name === " ") {
            console.log("_startCarry: " + this._startCarry);
            console.log("_nextCarry : " + this.NextCarry);
        }

        let moveTarget = null;

        if (this.NextCarry < this.Capacity) {
            if (!this.AtWork) {
                this.moveToRoom(this.WorkRoom.Name);
            }
            else {
                let resourceNode = this.ResourceNode;
                if (resourceNode) {
                    if (!this.creep.pos.isNearTo(resourceNode)) {
                        moveTarget = resourceNode;
                    }
                    else if (!standsOnContainer && this.Room.Containers.length > 0){
                        // Need to reposition to on top of the container.
                        let containers = resourceNode.pos.findInRange(this.Room.Containers, 1);
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
                this.moveToRoom(this.HomeRoom.Name);
            }
            else {
                if (this.Room.Storage) {
                    moveTarget = this.Room.Storage;
                }
                else {
                    // This should only happen early on before there is a temporary or real storage.
                    // The this.Extensions array only holds extensions with available space.
                    let extension = this.creep.pos.findClosestByRange(this.Room.Extensions);
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
