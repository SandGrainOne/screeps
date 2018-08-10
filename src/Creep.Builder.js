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

        // Tick cache
        this._cache = {};
    }

    /**
     * Gets the creep job target. 
     */
    get target () {
        if (this._cache.target === undefined) {
            this._cache.target = Game.getObjectById(this._mem.work.target); // TODO: work.target might be undefined.
        }
        return this._cache.target;
    }

    /**
     * Sets the creep job target. 
     */
    set target (obj) {
        if (obj !== null) {
            this._cache.target = obj;
            this._mem.work.target = obj.id;
        }
        else {
            this._cache.target = null;
            delete this._mem.work.target;
        }
    }

    /**
     * Perform building and repair related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work () {
        let moveTarget = null;

        if (this.atWork) {
            if (this.target !== null) {
                if (this.target instanceof ConstructionSite || this.target.hits < this.target.hitsMax) {
                    if (!this.room.reserve(this.target.id, this.job, this.name)) {
                        this.target = null;
                    }
                }
                else {
                    this.target = null;
                }
            }

            if (this.target === null && this.energy > 0) {
                this.target = this.findTarget();
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
                this.target = null;
            }
        }

        if (this.energy >= this.capacity) {
            this.task = 'work';

            if (this.target === null && this.atWork) {
                this.target = this.findTarget();
            }
        }

        if (this.task === 'work') {
            if (!this.atWork) {
                moveTarget = this.moveToRoom(this.WorkRoom.name, false);
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
            if (!moveTarget && (this.isHome || this.atWork) && !this.room.storage) {
                if (!moveTarget && this.room.containers.length > 0) {
                    let container = this.pos.findClosestByRange(this.room.containers);
                    if (container && container.store.energy > 0) {
                        moveTarget = container;
                    }
                }

                if (!moveTarget && this.room.sources.length > 0) {
                    let source = this.pos.findClosestByRange(this.room.sources);
                    if (source) {
                        moveTarget = source;
                    }
                }
            }

            if (!moveTarget && !this.isHome) {
                moveTarget = this.moveToRoom(this.HomeRoom.name, false);
            }

            if (!moveTarget && this.room.storage) {
                let storage = this.room.storage;
                if (storage && storage.store.energy > 0) {
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
        if (Game.time % 3 === 0) {
            if (this.room.constructionSites.length > 0) {
                for (let site of this.room.constructionSites) {
                    if (this.room.reserve(site.id, this.job, this.name)) {
                        return site;
                    }
                }
            }
        }

        if (this.room.repairs.length > 0) {
            for (let repairs of this.room.repairs) {
                if (this.room.reserve(repairs.id, this.job, this.name)) {
                    return repairs;
                }
            }
        }

        return null;
    }
}

module.exports = CreepBuilder;
