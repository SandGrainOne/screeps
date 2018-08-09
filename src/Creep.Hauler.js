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
        if (this.Strength > 0 && this.StartEnergy > 0) {
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

        if (this.NextCarry < this.Capacity) {
            let drops = this.creep.pos.findInRange(this.Room.drops, 1);
            if (drops.length > 0) {
                for (let drop of drops) {
                    if (this.pickup(drop) === OK) {
                        break;
                    }
                }
            }
        }

        // Taking from a container should only be done in the work room.
        if (this.AtWork && this.NextCarry < this.Capacity) {
            if (this.Room.containers.length > 0) {
                let containers = this.creep.pos.findInRange(this.Room.containers, 1);
                if (containers.length > 0) {
                    // TODO: Object.keys(containers[0].store).length === 1)
                    for (let resourceType in containers[0].store) {
                        if (this.withdraw(containers[0], resourceType) === OK) {
                            break;
                        }
                    }
                }
            }
        }

        // Delivering to a container or link should only be done by a remote hauler back at home.
        if (this.isRemoting && this.AtHome && this.NextCarry > 0) {
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
            if (this.EndEnergy > 0 && this.Room.Links.Inputs.length > 0) {
                let links = this.creep.pos.findInRange(this.Room.Links.Inputs, 1);
                if (links.length > 0) {
                    for (let link of links) {
                        if (this.transfer(link, RESOURCE_ENERGY) === OK ) {
                            break;
                        }
                    }
                }
            }
        }

        if (this.AtHome) {
            let storage = this.Room.storage;
            if (storage && this.creep.pos.isNearTo(storage)) {
                for (let resourceType in this.creep.carry) {
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

            if (!moveTarget) {
                // A hauler that is room jumping should pick up resources in any room
                // except at home. Drops at home should be handled by local haulers.
                if ((this.isRemoting && !this.AtHome) || (!this.isRemoting && this.AtWork)) {
                    if (this.Room.drops.length > 0) {
                        for (let drop of this.Room.drops) {
                            if (this.Room.reserve(drop.id, this.name)) {
                                moveTarget = drop;
                                break;
                            }
                        }
                    }
                }
            }

            if (!moveTarget && !this.AtWork) {
                moveTarget = this.moveToRoom(this.WorkRoom.name, false);
            }

            if (!moveTarget) {
                if (this.Room.containers.length > 0) {
                    for (let container of this.Room.containers) {
                        if (this.Room.reserve(container.id, this.name)) {
                            moveTarget = container;
                            break;
                        }
                    }
                }
            }
        }
        else {
            if (!moveTarget && !this.AtHome) {
                moveTarget = this.moveToRoom(this.HomeRoom.name, false);
            }
            
            if (!moveTarget) {
                let range = 50;
            
                // Ensure the creep only carry energy. No need to seek out a link otherwise.
                if (this.isRemoting && this.EndEnergy > 0 && this.EndEnergy === this.NextCarry && this.Room.Links.Inputs.length > 0) {

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

                if (this.Room.storage) {
                    let rangeToStorage = this.creep.pos.getRangeTo(this.Room.storage);
                    if (range > 10 || range >= rangeToStorage) {
                        moveTarget = this.Room.storage;
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

        if (moveTarget) {
            this.moveTo(moveTarget);
        }

        return true;
    }
}

module.exports = CreepHauler;
