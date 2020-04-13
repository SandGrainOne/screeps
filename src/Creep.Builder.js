'use strict';

let CreepWorker = require('./Creep.Worker');

/**
 * Wrapper class for creeps with logic for a builder.
 * Primary porpose of these creeps are to build and repair structures.
 */
class CreepBuilder extends CreepWorker {
    /**
     * Initializes a new instance of the CreepBuilder class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor (creep) {
        super(creep);

        if (this.task === null) {
            this.task = 'charge';
        }
    }

    /**
     * Perform building and repair related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work () {
        if (this.target === null && this.energy > 0) {
            this.target = this.findTarget();
        }

        if (this.target !== null && this.target.isFake && this.atWork) {
            // A fake target in a visible room. Find another target.
            this.target = null;
        }

        if (this.atWork) {
            if (this.target !== null) {
                if (!(this.target instanceof ConstructionSite)) {
                    if (this.target.hits < this.target.hitsMax) {
                        if (!this.room.reserve(this.target.id, this.job, this.name)) {
                            this.target = null;
                        }
                    }
                    else {
                        this.target = null;
                    }
                }
            }

            if (this.target !== null && this.energy > 0) {
                if (this.pos.getRangeTo(this.target) <= 3) {
                    if (this.target instanceof ConstructionSite) {
                        this.build(this.target);
                    }
                    else {
                        this.repair(this.target);
                    }
                }
            }
        }

        if (this.energy < this.capacity) {
            if (this.isHome) {
                let storage = this.room.storage;
                if (storage && storage.store.energy > 0 && this.pos.isNearTo(storage)) {
                    this.withdraw(storage, RESOURCE_ENERGY);
                }
            }

            if (this.room.containers.length > 0) {
                let container = this.getFirstInRange(this.room.containers, 1);
                if (container !== null && container.store.energy > 0) {
                    this.withdraw(container, RESOURCE_ENERGY);
                }
            }

            if (this.room.sources.length > 0) {
                let source = this.getFirstInRange(this.room.sources, 1);
                if (source) {
                    this.harvest(source);
                }
            }
        }

        if (this.energy <= 0) {
            this.task = 'charge';

            if (this.target !== null) {
                // Get a new target next time
                this.target = null;
            }
        }

        if (this.energy >= this.capacity) {
            this.task = 'work';

            if (this.target === null) {
                this.target = this.findTarget();
            }
        }

        let moveTarget = null;

        if (this.task === 'work') {
            if (!this.atWork && this.target === null) {
                moveTarget = this.moveToRoom(this._mem.rooms.work, false);
            }
            else {
                if (this.target !== null) {
                    if (this.pos.getRangeTo(this.target) > 3) {
                        moveTarget = this.target;
                    }
                }
            }
        }

        if (this.task === 'charge') {
            if (moveTarget === null && (this.isHome || this.atWork) && (this.room.storage === null || this.room.storage.store.getUsedCapacity() < 1000)) {
                if (moveTarget === null && this.room.containers.length > 0) {
                    let container = this.getClosestByRange(this.room.containers);
                    if (container !== null && container.store.energy > 0) {
                        moveTarget = container;
                    }
                }

                if (moveTarget === null && this.room.sources.length > 0) {
                    let source = this.getClosestByRange(this.room.sources);
                    if (source !== null) {
                        moveTarget = source;
                    }
                }
            }

            if (moveTarget === null && !this.isHome) {
                moveTarget = this.moveToRoom(this._mem.rooms.home, false);
            }

            if (moveTarget === null && this.room.storage) {
                let storage = this.room.storage;
                if (storage !== null && storage.store.energy > 0) {
                    moveTarget = storage;
                }
            }
        }

        if (moveTarget !== null) {
            this.moveTo(moveTarget);
        }

        return true;
    }

    findTarget () {
        let room = this.atWork ? this.room : this.workRoom;
        if (!room.isVisible) {
            return null;
        }

        if (Game.time % 3 === 0) {
            if (room.constructionSites.length > 0) {
                for (let site of room.constructionSites) {
                    return site;
                }
            }
        }

        if (room.repairs.length > 0) {
            for (let repairs of room.repairs) {
                if (room.reserve(repairs.id, this.job, this.name)) {
                    return repairs;
                }
            }
        }

        return null;
    }
}

module.exports = CreepBuilder;
