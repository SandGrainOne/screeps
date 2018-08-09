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
        if (this.Job === "miner") {
            if (this.mem.resourceid) {
                let source = Game.getObjectById(this.mem.resourceid);
                if (source && (source.energy > 0 || (source.ticksToRegeneration || 300) < 50)) {
                    if (this.Room.reserveTarget(source.id, this.Name)) {
                        return source;
                    }
                }
            }

            if (this.Room.Resources.Sources.length > 0) {
                for (let source of this.Room.Resources.Sources) {
                    if (source && (source.energy > 0 || (source.ticksToRegeneration || 300) < 50)) {
                        if (this.Room.reserveTarget(source.id, this.Name)) {
                            this.mem.resourceid = source.id;
                            return source;
                        }
                    }
                }
            }
        }
        else if (this.Job === "mineralminer") {
            if (this.Room.Resources.Minerals) {
                return this.Room.Resources.Minerals;
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

        let moveTarget = null;

        if (this.NextCarry < this.Capacity) {
            if (!this.AtWork) {
                this.moveToRoom(this.WorkRoom.name);
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
                this.moveToRoom(this.HomeRoom.name);
            }
            else {
                if (!moveTarget) {
                    let range = 50;
                    // Ensure the creep only carry energy. No need to seek out a link otherwise.
                    if (this.EndEnergy > 0 && this.EndEnergy === this.NextCarry && this.Room.Links.Inputs.length > 0) {
                        for (let link of this.Room.Links.Inputs) {
                            if (link.energy >= link.energyCapacity) {
                                continue;
                            }

                            let rangeToLink = this.creep.pos.getRangeTo(link);
                            if (range > rangeToLink) {
                                range = rangeToLink;
                                moveTarget = link;
                            }
                        }
                    }

                    if (this.Room.Containers.length > 0) {
                        for (let container of this.Room.Containers) {
                            if (_.sum(container.store) >= container.storeCapacity) {
                                continue;
                            }

                            let rangeToContainer = this.creep.pos.getRangeTo(container);
                            if (range > rangeToContainer) {
                                range = rangeToContainer;
                                moveTarget = container;
                            }
                        }
                    }

                    if (this.Room.Storage) {
                        let rangeToStorage = this.creep.pos.getRangeTo(this.Room.Storage);
                        if (range > 10 || range >= rangeToStorage) {
                            moveTarget = this.Room.Storage;
                        }
                    }
                }

                if (!moveTarget) {
                    // This should only happen early on before there is a temporary or real storage.
                    // The this.Extensions array only holds extensions and spawns with available space.
                    if (this.EndEnergy > 0 && this.Room.Extensions.length > 0) {
                        let extension = this.creep.pos.findClosestByRange(this.Room.Extensions);
                        if (extension) {
                            if (!this.creep.pos.isNearTo(extension)) {
                                moveTarget = extension;
                            }
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
