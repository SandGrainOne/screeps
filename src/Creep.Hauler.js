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
        if (this.strength > 0 && this.energy > 0) {
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

        if (this.load < this.capacity) {
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
        if (this.atWork && this.load < this.capacity) {
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

        if (!this.isRemoting && this.isHome && this.load < this.capacity) {
            if (this.Room.terminal && (this.Room.terminal.store.energy > C.TERMINAL_THRESHOLD_ENERGY || this.Room.terminal.store.energy > this.Room.storage.store.energy)) {
                this.withdraw(this.Room.terminal, RESOURCE_ENERGY);
            }
        }

        // Delivering to a container or link should only be done by a remote hauler back at home.
        if (this.isRemoting && this.isHome && this.load > 0) {
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
            if (this.energy > 0 && this.Room.Links.Inputs.length > 0) {
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

        if (this.isHome) {
            let storage = this.Room.storage;
            if (storage && this.creep.pos.isNearTo(storage)) {
                for (let resourceType in this.creep.carry) {
                    if (this.transfer(storage, resourceType) === OK) {
                        break;
                    }
                }
            }

            if (this.Room.extensions.length > 0) {
                let extensions = this.creep.pos.findInRange(this.Room.extensions, 1);
                if (extensions.length > 0) {
                    this.transfer(extensions[0], RESOURCE_ENERGY);
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
            
            let target = Game.getObjectById(this.mem.job.target);
            if (target === null) {
                delete this.mem.job.target;
            }
            
            /*
            if (!moveTarget && this.mem.job.target) {
                let target = Game.getObjectById(this.mem.job.target);
                if (target !== null) {
                    moveTarget = target;
                }
                else {
                    delete this.mem.job.target;
                }
            }
            */
            if (!moveTarget) {
                // A hauler should pick up drops only in the room they have been ordered to work in.
                if (this.atWork) {
                    if (this.Room.drops.length > 0) {
                        for (let drop of this.Room.drops) {
                            if (this.Room.reserve(drop.id, this.job, this.name)) {
                                this.mem.job.target = drop.id;
                                moveTarget = drop;
                                break;
                            }
                        }
                    }
                }
            }

            if (!moveTarget && !this.atWork) {
                moveTarget = this.moveToRoom(this.WorkRoom.name, false);
            }

            if (!moveTarget) {
                if (this.Room.containers.length > 0) {
                    for (let container of this.Room.containers) {
                        if (_.sum(container.store) > 500) {
                            if (this.Room.reserve(container.id, this.job, this.name)) {
                                this.mem.job.target = container.id;
                                moveTarget = container;
                                break;
                            }
                        }
                    }
                }
            }

            if (!moveTarget && !this.isRemoting && this.isHome && this.load < this.capacity) {
                if (this.Room.terminal) {
                    this.mem.job.target = this.Room.terminal.id;
                    moveTarget = this.Room.terminal;
                }
            }
        }
        else {
            if (!moveTarget && !this.isHome) {
                moveTarget = this.moveToRoom(this.HomeRoom.name, false);
            }

            if (!moveTarget) {
                let range = 50;

                // Ensure the creep only carry energy. No need to seek out a link otherwise.
                if (this.isRemoting && this.energy > 0 && this.energy === this.load && this.Room.Links.Inputs.length > 0) {

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
                    if (range > 4 || range >= rangeToStorage) {
                        moveTarget = this.Room.storage;
                    }
                }
            }

            if (!moveTarget) {
                // This should only happen early on before there is a temporary or real storage.
                // The this.extensions array only holds extensions and spawns with available space.
                if (this.energy > 0 && this.Room.extensions.length > 0) {
                    let extension = this.creep.pos.findClosestByRange(this.Room.extensions);
                    if (extension) {
                        moveTarget = extension;
                    }
                }
            }
        }

        if (moveTarget) {
            if (moveTarget && (moveTarget.structureType !== STRUCTURE_CONTAINER || !this.creep.pos.isNearTo(moveTarget))) {
                this.moveTo(moveTarget);
            }
        }

        return true;
    }
}

module.exports = CreepHauler;
