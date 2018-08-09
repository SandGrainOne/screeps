'use strict';

let C = require('constants');

let CreepWorker = require('Creep.Worker');

/**
 * Wrapper class for creeps with logic for a hauler.
 * Primary purpose of these creeps are to move resources from the perimeter of a room and into the center.
 */
class CreepHauler extends CreepWorker { 
    /**
     * Initializes a new instance of the CreepHauler class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep) {
        super(creep);
    }
    
    /**
     * Perform hauling related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        // If possible, perform road repairs on the move.
        if (this.Strength > 0 && this.CargoAmount > Math.min(this.Strength, this.Capacity)) {
            let foundStructures = this.creep.pos.lookFor(LOOK_STRUCTURES);
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

        if (this.CargoAmount < this.Capacity) {
            // Using FIND_DROPPED_RESOURCES instead of Room.Resources.Drops. 
            // The later does not include drops at containers, but those must still be picked up.
            let drops = this.creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
            if (drops.length > 0) {
                for (let drop of drops) {
                    if (this.pickup(drop) === OK) {
                        break;
                    }
                }
            }
        }

        // Withdraw any resource from a container.
        if (this.AtWork && this.CargoAmount < this.Capacity) {
            if (this.Room.Containers.length > 0) {
                let containers = this.creep.pos.findInRange(this.Room.Containers, 1);
                // The containers are sorted. The one with the most in storage is first.
                if (containers.length > 0) {
                    // Object.keys(container.store).length;
                    for (let resourceType in containers[0].store) {
                        if (this.withdraw(containers[0], resourceType) === OK) {
                            break;
                        }
                    }
                }
            }
        }

        if (this.AtHome && this.CargoAmount > 0) {
            if (this.Room.Links.Inputs.length > 0) {
                let links = this.creep.pos.findInRange(this.Room.Links.Inputs, 1);
                if (links.length > 0) {
                    for (let link of links) {
                        if (this.transfer(link, RESOURCE_ENERGY) === OK ) {
                            break;
                        }
                    }
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
        }

        if (this.Name === "Penelope") {
            console.log("Carry: " + this.StartCarry);
            console.log("Next: " + this.CargoAmount);
        }

        if (this.CargoAmount <= 0) {
            this.IsWorking = true;
        }

        if (this.CargoAmount >= this.Capacity) {
            this.IsWorking = false;
        }

        let moveTarget = null;

        if (this.Name === "Penelope") {
            console.log("IsWorking: " + this.IsWorking);
        }

        if (this.IsWorking) {
            if (!this.AtWork) {
                this.moveToRoom(this.WorkRoom);
            }
            else {
                if (!moveTarget) {
                    if (this.Room.Resources.Drops.length > 0) {
                        for (let drop of this.Room.Resources.Drops) {
                            if (this.Room.reserveTarget(drop.id, this.Name)) {
                                if (!this.creep.pos.isNearTo(drop)) {
                                    moveTarget = drop;
                                }
                                break;
                            }
                        }
                    }
                }

                if (!moveTarget) {
                    if (this.Room.Containers.length > 0) {
                        for (let container of this.Room.Containers) {
                            if (this.Room.reserveTarget(container.id, this.Name)) {
                                if (!this.creep.pos.isNearTo(container)) {
                                    moveTarget = container;
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
        else {

            if (this.Name === "Penelope") {
                console.log("AtHome: " + this.AtHome);
            }
            if (!this.AtHome) {
                this.moveToRoom(this.HomeRoom);
            }
            else {
                if (!moveTarget) {
                    if (this.Room.Links.Inputs.length > 0) {
                        let links = this.creep.pos.findInRange(this.Room.Links.Inputs, 1);
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
                    if (this.Room.Storage && !this.creep.pos.isNearTo(this.Room.Storage)) {
                        moveTarget = this.Room.Storage;
                    }
                }

                if (!moveTarget) {
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

module.exports = CreepHauler;
