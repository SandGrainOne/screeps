'use strict';

let C = require('constants');

let CreepWorker = require('Creep.Worker');

/**
 * Wrapper class for creeps with logic for a refueler.
 * Primary purpose of these creeps are to keep the towers, spawn and extensions stocked with energy in that order.
 */
class CreepBalancer extends CreepWorker {

    /**
     * Initializes a new instance of the CreepRefueler class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep) {
        super(creep);
    }
    
    /**
     * Perform refueling related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        if (!this.isRemoting) {
            return false;
        }
        
        // If possible, perform road repairs on the move.
        if (this.strength > 0 && this.energy > 0) {
            let foundStructures = this.pos.lookFor(LOOK_STRUCTURES);
            if (foundStructures.length > 0) {
                for (let structure of foundStructures) {
                    if (structure.structureType === STRUCTURE_ROAD) {
                        if (structure.hits < structure.hitsMax) {
                            if (this.repair(structure) === OK) {
                                break;
                            }
                        }
                    }
                }
            }
        }

        if (this.atWork && this.load <= 0) {
            let storage = this.room.storage;
            if (storage) {
                if (this.pos.isNearTo(storage)) {
                    this.withdraw(storage, RESOURCE_ENERGY);
                }
            }
        }

        if (this.isHome && this.load > 0) {
            if (this.room.Links.Inputs.length > 0) {
                let links = this.pos.findInRange(this.room.Links.Inputs, 1);
                if (links.length > 0) {
                    for (let link of links) {
                        if (this.transfer(link, RESOURCE_ENERGY) === OK ) {
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

        if (this.load <= 0) {
            this.isWorking = true;
        }

        if (this.load >= this.capacity) {
            this.isWorking = false;
        }

        let moveTarget = null;

        if (this.isWorking) {
            if (!this.atWork) {
                this.moveToRoom(this.WorkRoom.name);
            }
            else {
                let storage = this.room.storage;
                if (storage) {
                    if (!this.pos.isNearTo(storage)) {
                        moveTarget = storage;
                    }
                }
            }
        }
        else {
            if (!this.isHome) {
                this.moveToRoom(this.HomeRoom.name);
            }
            else {
                if (!moveTarget) {
                    if (this.room.Links.Inputs.length > 0) {
                        let links = this.pos.findInRange(this.room.Links.Inputs, 1);
                        if (links.length > 0) {
                            for (let link of links) {
                                if (link.energy < link.energyCapacity) {
                                    moveTarget = link;
                                    break;
                                }
                            }
                        }
                    }
                }

                if (!moveTarget) {
                    if (this.room.storage && !this.pos.isNearTo(this.room.storage)) {
                        moveTarget = this.room.storage;
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

module.exports = CreepBalancer;
