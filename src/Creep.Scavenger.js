'use strict';

let C = require('./constants');

let CreepWorker = require('./Creep.Worker');

/**
 * Wrapper class for creeps with logic for a scavenger.
 * Primary purpose of these creeps are to scavenger the remains of the dead.
 */
class CreepScavenger extends CreepWorker {
    /**
     * Perform resource collection logic.
     */
    collecting () {
        // Perform random repairs or construction work.
        this.working();

        // Drops can be picked up by any hauler on the move in any room
        if (this.room.drops.length > 0) {
            let drop = this.getFirstInRange(this.room.drops, 1);
            if (!_.isNull(drop)) {
                this.pickup(drop);
            }
        }

        let room = this.workRoom;

        if (!this.atWork && !room.isVisible) {
            Empire.observe(room.name, 10);
            this.moveTo(new RoomPosition(25, 25, room.name), { 'range': 20 });
            return;
        }

        if (room.containers.length > 0) {
            let container = this.getFirstInRange(room.containers, 1);
            if (!_.isNull(container)) {
                for (let resourceType in container.store) {
                    if (this.withdraw(container, resourceType) === OK) {
                        break;
                    }
                }
            }
        }

        let target = Game.getObjectById(this._mem.collectingTarget);
        if (_.isNull(target)) {
            delete this._mem.collectingTarget;
        }

        if (this.room.drops.length > 0) {
            for (let drop of this.room.drops) {
                if (this.room.reserve(drop.id, this.job, this.name)) {
                    this._mem.collectingTarget = drop.id;
                    break;
                }
            }
        }
    }

    /**
     * Perform resource delivery logic.
     */
    delivering () {
        // Perform random repairs or construction work.
        this.working();
    }

    /**
     * Perform scavenger related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work () {
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

        if (this.load < this.capacity) {
            let drop = this.getFirstInRange(this.room.drops, 1);
            if (drop) {
                this.pickup(drop);
            }
        }

        if (!this.isRemoting && this.isHome && this.load < this.capacity) {
            if (this.room.terminal && (this.room.terminal.store.energy > C.TERMINAL_THRESHOLD_ENERGY || this.room.terminal.store.energy > this.room.storage.store.energy)) {
                this.withdraw(this.room.terminal, RESOURCE_ENERGY);
            }
        }

        if (this.isRemoting && this.isHome && this.load > 0) {
            if (this.room.containers.length > 0) {
                let container = this.getFirstInRange(this.room.containers, 1);
                if (container) {
                    for (let resourceType in this.carry) {
                        if (this.transfer(container, resourceType) === OK) {
                            break;
                        }
                    }
                }
            }
            if (this.energy > 0 && this.room.links.inputs.length > 0) {
                let links = this.pos.findInRange(this.room.links.inputs, 1);
                if (links.length > 0) {
                    for (let link of links) {
                        if (link.energy < link.energyCapacity) {
                            this.transfer(link, RESOURCE_ENERGY);
                        }
                    }
                }
            }
        }

        if (this.isHome) {
            let storage = this.room.storage;
            if (storage && this.pos.isNearTo(storage)) {
                for (let resourceType in this.carry) {
                    if (this.transfer(storage, resourceType) === OK) {
                        break;
                    }
                }
            }

            if (this.room.extensions.length > 0) {
                let extension = this.getFirstInRange(this.room.extensions, 1);
                if (extension) {
                    this.transfer(extension, RESOURCE_ENERGY);
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
            let target = Game.getObjectById(this._mem.work.target);
            if (target === null) {
                delete this._mem.work.target;
            }

            if (!moveTarget) {
                // A scavenger should seek out drops only in the room they have been ordered to work in.
                if (this.atWork) {
                    if (this.room.drops.length > 0) {
                        for (let drop of this.room.drops) {
                            if (this.room.reserve(drop.id, this.job, this.name)) {
                                this._mem.target = drop.id;
                                moveTarget = drop;
                                break;
                            }
                        }
                    }
                }
            }

            if (!moveTarget && !this.atWork) {
                moveTarget = this.moveToRoom(this._mem.rooms.work, false);
            }

            if (!moveTarget) {
                if (this.room.containers.length > 0) {
                    for (let container of this.room.containers) {
                        if (_.sum(container.store) > 400) {
                            if (this.room.reserve(container.id, this.job, this.name)) {
                                this._mem.work.target = container.id;
                                moveTarget = container;
                                break;
                            }
                        }
                    }
                }
            }

            if (!moveTarget && !this.isRemoting && this.isHome && this.load < this.capacity) {
                if (this.room.terminal) {
                    this._mem.work.target = this.room.terminal.id;
                    moveTarget = this.room.terminal;
                }
            }
        }
        else {
            if (!moveTarget && !this.isHome) {
                moveTarget = this.moveToRoom(this._mem.rooms.home, false);
            }

            if (!moveTarget) {
                let range = 50;

                // Ensure the creep only carry energy. No need to seek out a link otherwise.
                if (this.isRemoting && this.energy > 0 && this.energy === this.load && this.room.links.inputs.length > 0) {
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

                if (this.room.storage) {
                    let rangeToStorage = this.pos.getRangeTo(this.room.storage);
                    if (range > 4 || range >= rangeToStorage) {
                        moveTarget = this.room.storage;
                    }
                }
            }

            if (!moveTarget) {
                // This should only happen early on before there is a temporary or real storage.
                // The this.extensions array only holds extensions and spawns with available space.
                if (this.energy > 0 && this.room.extensions.length > 0) {
                    let extension = this.pos.findClosestByRange(this.room.extensions);
                    if (extension) {
                        moveTarget = extension;
                    }
                }
            }
        }

        if (moveTarget) {
            this.moveTo(moveTarget);
        }

        return true;
    }

    /**
     * Analyze the room and identify the appropriate number of scavengers as well as their body.
     * 
     * @param room - An instance of a visible smart room.
     */
    static defineJob (room) {
    }
}

module.exports = CreepScavenger;
