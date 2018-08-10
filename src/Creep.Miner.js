'use strict';

let C = require('constants');

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
        if (this.job === "miner") {
            if (this.mem.resourceid) {
                let source = Game.getObjectById(this.mem.resourceid);
                if (source && (source.energy > 0 || (source.ticksToRegeneration || 300) < 50)) {
                    if (this.Room.reserve(source.id, this.job, this.name)) {
                        return source;
                    }
                }
            }

            if (this.Room.sources.length > 0) {
                for (let source of this.Room.sources) {
                    if (source && (source.energy > 0 || (source.ticksToRegeneration || 300) < 50)) {
                        if (this.Room.reserve(source.id, this.job, this.name)) {
                            this.mem.resourceid = source.id;
                            return source;
                        }
                    }
                }
            }
        }
        else if (this.job === "mineralminer") {
            if (this.Room.hasMinerals) {
                return this.Room.minerals;
            }
            else {
                // This will cause the creeper to seek a spawn and order recycling.
                this.mem.recycle = true;
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

        if (this.atWork && this.energy >= 0) {
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
        if (!performedWork && this.atWork && this.load <= this.capacity) {
            let resourceNode = this.ResourceNode;
            if (resourceNode && this.creep.pos.isNearTo(resourceNode)) {
                if (resourceNode.mineralType) {
                    if (this.Room.extractor && this.Room.extractor.cooldown <= 0) {
                        this.harvest(resourceNode);
                    }
                } 
                else {
                    this.harvest(resourceNode);
                }
            }
        }

        if (this.load >= this.capacity && standsOnContainer) {
            for (let resourceType in this.creep.carry) {
                if (this.drop(resourceType) === OK) {
                    break;
                }
            }
        }
        
        if (this.load >= this.capacity) {
            if (this.Room.containers.length > 0) {
                let containers = this.creep.pos.findInRange(this.Room.containers, 1);
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

            let storage = this.Room.storage;
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

        let moveTarget = null;

        if (this.load < this.capacity) {
            if (!moveTarget && !this.atWork) {
                moveTarget = this.moveToRoom(this.WorkRoom.name, false);
            }
            
            if (!moveTarget) {
                let resourceNode = this.ResourceNode;
                if (resourceNode) {
                    if (!this.creep.pos.isNearTo(resourceNode)) {
                        moveTarget = resourceNode;
                    }
                    else if (!standsOnContainer && this.Room.containers.length > 0){
                        // Need to reposition to on top of the container.
                        let containers = resourceNode.pos.findInRange(this.Room.containers, 1);
                        if (containers.length === 1) {
                            moveTarget = containers[0];
                        }
                        else if (containers.length > 1) {
                            // TODO: See room E78N62
                        }
                    }
                }
                else {
                    return false;
                }
            }
        }
        else {
            if (!moveTarget) {
                let range = 50;
                // Ensure the creep only carry energy. No need to seek out a link otherwise.
                if (this.energy > 0 && this.energy === this.load && this.Room.Links.Inputs.length > 0) {
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

                if (this.Room.containers.length > 0) {
                    for (let container of this.Room.containers) {
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

                if (this.isHome && this.Room.storage) {
                    let rangeToStorage = this.creep.pos.getRangeTo(this.Room.storage);
                    if (range > 10 || range >= rangeToStorage) {
                        range = rangeToStorage;
                        moveTarget = this.Room.storage;
                    }
                }
            }

            if (!moveTarget && !this.isHome) {
                moveTarget = this.moveToRoom(this.HomeRoom.name, false);
            }

            if (!moveTarget) {
                // This should only happen early on before there is a storage in the room.
                // The this.Extensions array only holds extensions and spawns with available space.
                if (this.energy > 0 && this.Room.Extensions.length > 0) {
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
