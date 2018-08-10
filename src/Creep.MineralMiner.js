'use strict';

let C = require('constants');

let CreepWorker = require('Creep.Worker');

/**
 * Wrapper class for creeps with logic for a miner.
 * Primary purpose of these creeps are to harvest energy or minerals.
 */
class CreepMineralMiner extends CreepWorker {
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
        let standsOnContainer = false;

        if (this.atWork && this.energy >= 0) {
            let foundStructures = this.pos.lookFor(LOOK_STRUCTURES);
            if (foundStructures.length > 0) {
                for (let structure of foundStructures) {
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
                let containers = this.pos.findInRange(this.room.containers, 1);
                if (containers.length > 0) {
                    for (let resourceType in this.carry) {
                        if (this.transfer(containers[0], resourceType) === OK) {
                            break;
                        }
                    }
                }
            }

            let storage = this.room.storage;
            if (storage && this.pos.isNearTo(storage)) {
                for (let resourceType in this.carry) {
                    if (this.transfer(storage, resourceType) === OK) {
                        break;
                    }
                }
            }
        }

        let moveTarget = null;

        if (this.load < this.capacity) {
            if (!moveTarget && !this.atWork) {
                moveTarget = this.moveToRoom(this.WorkRoom.name, false);
            }
            
            if (!moveTarget) {
                if (this.room.minerals) {
                    if (!this.pos.isNearTo(this.room.minerals)) {
                        moveTarget = this.room.minerals;
                    }
                    else if (!standsOnContainer && this.room.containers.length > 0){
                        // Need to reposition to on top of the container.
                        let containers = this.room.minerals.pos.findInRange(this.room.containers, 1);
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
                if (this.energy > 0 && this.energy === this.load && this.room.Links.Inputs.length > 0) {
                    for (let link of this.room.Links.Inputs) {
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

            if (!moveTarget && !this.isHome) {
                moveTarget = this.moveToRoom(this.HomeRoom.name, false);
            }

            if (!moveTarget) {
                // This should only happen early on before there is a storage in the room.
                // The this.extensions array only holds extensions and spawns with available space.
                if (this.energy > 0 && this.room.extensions.length > 0) {
                    let extension = this.pos.findClosestByRange(this.room.extensions);
                    if (extension) {
                        if (!this.pos.isNearTo(extension)) {
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

module.exports = CreepMineralMiner;
