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
        if (this.AtWork && this.AtHome) {
            this.creep.say("work?")
            return true;
        }
        
        // If possible, perform road repairs on the move.
        if (this.Strength > 0 && this.StartEnergy >= Math.min(this.Strength, this.Capacity)) {
            let foundStructures = this.creep.pos.lookFor(LOOK_STRUCTURES);
            if (foundStructures.length > 0) {
                for (var structure of foundStructures) {
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

        if (this.AtWork && this.NextCarry <= 0) {
            let storage = this.Room.storage;
            if (storage) {
                if (this.creep.pos.isNearTo(storage)) {
                    this.withdraw(storage, RESOURCE_ENERGY);
                }
            }
        }

        if (this.AtHome && this.NextCarry > 0) {
            if (this.Room.Links.Inputs.length > 0) {
                let links = this.creep.pos.findInRange(this.Room.Links.Inputs, 1);
                if (links.length > 0) {
                    for (var link of links) {
                        if (this.transfer(link, RESOURCE_ENERGY) === OK ) {
                            break;
                        }
                    }
                }
            }

            let storage = this.Room.storage;
            if (storage && this.creep.pos.isNearTo(storage)) {
                for (var resourceType in this.creep.carry) {
                    if (this.transfer(storage, resourceType) === OK) {
                        break;
                    }
                }
            }
        }

        if (this.NextCarry <= 0) {
            this.IsWorking = true;
        }

        if (this.NextCarry >= this.Capacity) {
            this.IsWorking = false;
        }

        let moveTarget = null;

        if (this.IsWorking) {
            if (!this.AtWork) {
                this.moveToRoom(this.WorkRoom.name);
            }
            else {
                let storage = this.Room.storage;
                if (storage) {
                    if (!this.creep.pos.isNearTo(storage)) {
                        moveTarget = storage;
                    }
                }
            }
        }
        else {
            if (!this.AtHome) {
                this.moveToRoom(this.HomeRoom.name);
            }
            else {
                if (!moveTarget) {
                    if (this.Room.Links.Inputs.length > 0) {
                        let links = this.creep.pos.findInRange(this.Room.Links.Inputs, 1);
                        if (links.length > 0) {
                            for (var link of links) {
                                if (link.energy < link.energyCapacity) {
                                    moveTarget = link;
                                    break;
                                }
                            }
                        }
                    }
                }

                if (!moveTarget) {
                    if (this.Room.storage && !this.creep.pos.isNearTo(this.Room.storage)) {
                        moveTarget = this.Room.storage;
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
