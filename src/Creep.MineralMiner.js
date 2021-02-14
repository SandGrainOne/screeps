'use strict';

const CreepWorker = require('./Creep.Worker');

/**
 * Wrapper class for creeps with logic for a miner.
 * Primary purpose of these creeps are to harvest energy or minerals.
 */
class CreepMineralMiner extends CreepWorker {
    /**
     * Perform mining related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work () {
        let standsOnContainer = false;

        if (this.atWork && this.energy >= 0) {
            const foundStructures = this.pos.lookFor(LOOK_STRUCTURES);
            if (foundStructures.length > 0) {
                for (const structure of foundStructures) {
                    if (structure.structureType === STRUCTURE_CONTAINER) {
                        standsOnContainer = true;
                    }
                }
            }
        }

        if (this.atWork && this.load <= this.capacity) {
            if (this.room.minerals && this.room.minerals.mineralAmount > 0) {
                if (this.pos.isNearTo(this.room.minerals)) {
                    if (this.room.extractor && this.room.extractor.cooldown <= 0) {
                        this.harvest(this.room.minerals);
                    }
                }
            }
            else {
                // The mineral miner doesn't have any work.
                this._mem.recycle = true;
            }
        }

        if (this.load >= this.capacity) {
            if (this.room.containers.length > 0) {
                const container = this.getFirstInRange(this.room.containers, 1);
                if (container) {
                    for (const resourceType in this.store) {
                        if (this.store[resourceType] > 0) {
                            if (this.transfer(container, resourceType) === OK) {
                                break;
                            }
                        }
                    }
                }
            }

            const storage = this.room.storage;
            if (storage && this.pos.isNearTo(storage)) {
                for (const resourceType in this.store) {
                    if (this.store[resourceType] > 0) {
                        if (this.transfer(storage, resourceType) === OK) {
                            break;
                        }
                    }
                }
            }
        }

        let moveTarget = null;

        if (this.load < this.capacity) {
            if (!moveTarget && !this.atWork) {
                moveTarget = this.moveToRoom(this._mem.rooms.work, false);
            }

            if (!moveTarget) {
                if (this.room.minerals) {
                    if (!this.pos.isNearTo(this.room.minerals)) {
                        moveTarget = this.room.minerals;
                    }
                    else if (!standsOnContainer && this.room.containers.length > 0) {
                        // Need to reposition to on top of the container.
                        const containers = this.room.minerals.pos.findInRange(this.room.containers, 1);
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
                if (this.room.containers.length > 0) {
                    for (const container of this.room.containers) {
                        if (container.store.getUsedCapacity() >= container.store.getCapacity()) {
                            continue;
                        }
                        const rangeToContainer = this.pos.getRangeTo(container);
                        if (range > rangeToContainer) {
                            range = rangeToContainer;
                            moveTarget = container;
                        }
                    }
                }

                if (this.isHome && this.room.storage) {
                    const rangeToStorage = this.pos.getRangeTo(this.room.storage);
                    if (range > 10 || range >= rangeToStorage) {
                        range = rangeToStorage;
                        moveTarget = this.room.storage;
                    }
                }
            }

            if (!moveTarget && !this.isHome) {
                moveTarget = this.moveToRoom(this._mem.rooms.home, false);
            }
        }

        if (moveTarget) {
            this.moveTo(moveTarget);
        }

        return true;
    }
}

module.exports = CreepMineralMiner;
