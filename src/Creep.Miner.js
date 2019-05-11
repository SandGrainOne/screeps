'use strict';

let CreepWorker = require('./Creep.Worker');

/**
 * Wrapper class for creeps with logic for a miner.
 * Primary purpose of these creeps are to harvest energy or minerals.
 */
class CreepMiner extends CreepWorker {
    get ResourceNode () {
        let room = this.atWork ? this.room : this.workRoom;
        if (!room.isVisible) {
            return null;
        }

        if (this._mem.resourceid) {
            let source = Game.getObjectById(this._mem.resourceid);
            if (source && (source.energy > 0 || (source.ticksToRegeneration || 300) < 50)) {
                if (this.isRetired || room.reserve(source.id, this.job, this.name)) {
                    return source;
                }
            }
        }

        if (room.sources.length > 0) {
            for (let source of room.sources) {
                if (source && (source.energy > 0 || (source.ticksToRegeneration || 300) < 50)) {
                    if (room.reserve(source.id, this.job, this.name)) {
                        this._mem.resourceid = source.id;
                        return source;
                    }
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
    work () {
        let standsOnContainer = false;
        let performedWork = false;

        if (this.atWork && this.energy >= 0) {
            let foundStructures = this.pos.lookFor(LOOK_STRUCTURES);
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
                if (this.strength > 0 && this.energy > 0) {
                    let constructionSite = this.getFirstInRange(this.room.constructionSites, 3);
                    if (constructionSite !== null) {
                        if (this.build(constructionSite) === OK) {
                            performedWork = true;
                        }
                    }
                }
            }
        }

        // The creep can't both repair/build and harvest in the same tick.
        if (!performedWork && this.atWork && this.load <= this.capacity) {
            let resourceNode = this.ResourceNode;
            if (resourceNode !== null && this.pos.isNearTo(resourceNode)) {
                if (resourceNode.mineralType) {
                    if (this.room.extractor && this.room.extractor.cooldown <= 0) {
                        this.harvest(resourceNode);
                    }
                }
                else {
                    this.harvest(resourceNode);
                }
            }
        }

        if (this.load >= this.capacity && standsOnContainer) {
            for (let resourceType in this.carry) {
                if (this.drop(resourceType) === OK) {
                    break;
                }
            }
        }

        if (this.load >= this.capacity) {
            if (this.room.containers.length > 0) {
                let container = this.getFirstInRange(this.room.containers, 1);
                if (container !== null) {
                    for (let resourceType in this.carry) {
                        if (this.transfer(container, resourceType) === OK) {
                            break;
                        }
                    }
                }
            }

            if (this.room.links && this.room.links.inputs.length > 0) {
                let link = this.getFirstInRange(this.room.links.inputs, 1);
                if (link !== null) {
                    this.transfer(link, RESOURCE_ENERGY);
                }
            }

            let storage = this.room.storage;
            if (storage !== null && this.pos.isNearTo(storage)) {
                for (let resourceType in this.carry) {
                    if (this.transfer(storage, resourceType) === OK) {
                        break;
                    }
                }
            }

            if (this.room.spawns.length > 0) {
                let spawn = this.getFirstInRange(this.room.spawns, 1, (x) => x.energy < x.energyCapacity);
                if (spawn !== null) {
                    this.transfer(spawn, RESOURCE_ENERGY);
                }
            }

            if (this.room.extensions.length > 0) {
                let extension = this.getFirstInRange(this.room.extensions, 1, (x) => x.energy < x.energyCapacity);
                if (extension !== null) {
                    this.transfer(extension, RESOURCE_ENERGY);
                }
            }
        }

        let moveTarget = null;

        if (this.load < this.capacity) {
            if (moveTarget === null && !this.atWork) {
                let resourceNode = this.ResourceNode;
                if (resourceNode !== null) {
                    moveTarget = resourceNode;
                }
                else {
                    moveTarget = this.moveToRoom(this._mem.rooms.work, false);
                }
            }

            if (moveTarget === null) {
                let resourceNode = this.ResourceNode;
                if (resourceNode !== null) {
                    if (!this.pos.isNearTo(resourceNode)) {
                        moveTarget = resourceNode;
                    }
                    else if (!standsOnContainer && this.room.containers.length > 0) {
                        // Need to reposition to on top of the container.
                        let containers = resourceNode.pos.findInRange(this.room.containers, 1);
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
            if (moveTarget === null) {
                let range = 50;
                // Ensure the creep only carry energy. No need to seek out a link otherwise.
                if (this.energy > 0 && this.energy === this.load && this.room.links.inputs.length > 0) {
                    for (let link of this.room.links.inputs) {
                        if (link.energy >= link.energyCapacity) {
                            continue;
                        }
                        let rangeToLink = this.pos.getRangeTo(link);
                        if (range > rangeToLink) {
                            range = rangeToLink;
                            moveTarget = link;
                        }
                    }
                }

                if (this.room.containers.length > 0) {
                    for (let container of this.room.containers) {
                        if (_.sum(container.store) >= container.storeCapacity) {
                            continue;
                        }
                        let rangeToContainer = this.pos.getRangeTo(container);
                        if (range > rangeToContainer) {
                            range = rangeToContainer;
                            moveTarget = container;
                        }
                    }
                }

                if (this.isHome && this.room.storage) {
                    let rangeToStorage = this.pos.getRangeTo(this.room.storage);
                    if (range > 10 || range >= rangeToStorage) {
                        range = rangeToStorage;
                        moveTarget = this.room.storage;
                    }
                }
            }

            if (moveTarget === null && !this.isHome) {
                moveTarget = this.moveToRoom(this._mem.rooms.home, false);
            }

            if (this.isHome && this.energy > 0) {
                // This should only happen early on before there is a storage in the room.
                if (moveTarget === null && this.room.spawns.length > 0) {
                    let spawn = this.getClosestByRange(this.room.spawns, (x) => x.energy < x.energyCapacity);
                    if (spawn !== null) {
                        moveTarget = spawn;
                    }
                }
                if (moveTarget === null && this.room.extensions.length > 0) {
                    let extension = this.getClosestByRange(this.room.extensions, (x) => x.energy < x.energyCapacity);
                    if (extension !== null) {
                        moveTarget = extension;
                    }
                }
            }
        }

        if (moveTarget !== null) {
            // Miners should move on to the same tile as a container. Not stop right before.
            let range = moveTarget.structureType === STRUCTURE_CONTAINER ? 0 : 1;
            this.moveTo(moveTarget, { 'range': range });
        }

        return true;
    }

    /**
     * Analyze the room and identify the appropriate number of miners as well as their body.
     * 
     * @param room - An instance of a visible smart room.
     */
    static defineJob (room) {
        if (room.sources.length === 0) {
            return;
        }

        let sourceCapacity = room.sources[0].energyCapacity;
        // Miners should be able to harvest all enery from a source alone.
        let workParts = Math.ceil(sourceCapacity / HARVEST_POWER * ENERGY_REGEN_TIME);
        if (room.isMine) {
            // Rooms at lower energy capacity will not be able to create creeps large enough.
            workParts = Math.min(Math.floor(room.energyCapacityAvailable / 250), workParts);
        }
        else {
            // Rooms not owned does not have builders. Miners are given an extra part to perform repairs.
            workParts = workParts + (Math.ceil(sourceCapacity / 600) === (sourceCapacity / 600) ? 1 : 0);
        }

        let carryParts = 1;
        // Make it an even number of parts before adding move.
        carryParts = carryParts + (workParts + carryParts) % 2;

        // A miner should have at least 2 move parts or 1 for every two other parts.
        let moveParts = Math.max((workParts + carryParts) / 2, 2);

        let job = {};
        job.number = room.sources.length;
        job.body = '' + workParts + ',W,' + carryParts + ',C,' + moveParts + ',M';

        return job;
    }
}

module.exports = CreepMiner;
