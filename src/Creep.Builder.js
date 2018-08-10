'use strict';

let C = require('constants');

let CreepWorker = require('Creep.Worker');

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
    constructor(creep) {
        super(creep);
        
        if (this.task === null) {
            this.task = "charge";
        }

        // Tick cache
        this._cache = {};
    }

    /**
     * Gets the creep job target. 
     */
    get target() {
        if (this._cache.target === undefined) {
            return this._cache.target = Game.getObjectById(this.mem.job.target); // job.target might be undefined.
        }
        return this._cache.target;
    }

    /**
     * Sets the creep job target. 
     */
    set target(obj) {
        if (obj !== null) {
            this._cache.target = obj;
            this.mem.job.target = obj.id;
        }
        else {
            this._cache.target = null;
            delete this.mem.job.target;
        }
    }

    /**
     * Perform building and repair related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        let moveTarget = null;
        let moveRequired = false;

        if (this.atWork) {
            if (this.target !== null) {
                if (this.target instanceof ConstructionSite || this.target.hits < this.target.hitsMax) {
                    if (!this.Room.reserve(this.target.id, this.job, this.name)) {
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
                if (this.creep.pos.getRangeTo(this.target) <= 3) {
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
                let storage = this.Room.storage;
                if (storage && storage.store.energy > 0 && this.creep.pos.isNearTo(storage)) {
                    this.withdraw(storage, RESOURCE_ENERGY);
                }
            }

            if (this.Room.containers.length > 0) {
                let container = this.getFirstInRange(this.Room.containers, 1);
                if (container !== null && container.store.energy > 0) {
                    this.withdraw(container, RESOURCE_ENERGY);
                }
            }

            if (this.Room.sources.length > 0) {
                let sources = this.creep.pos.findInRange(this.Room.sources, 1);
                if (sources[0] && this.creep.pos.isNearTo(sources[0])) {
                    this.harvest(sources[0]);
                }
            }
        }

        if (this.energy <= 0) {
            this.task = "charge";

            if (this.target !== null) {
                this.target = null;
            }
        }

        if (this.energy >= this.capacity) {
            this.task = "work";

            if (this.target === null && this.atWork) {
                this.target = this.findTarget();
            }
        }

        if (this.task === "work") {
            if (!this.atWork) {
                moveTarget = this.moveToRoom(this.WorkRoom.name, false);
            }
            else {
                if (this.target !== null) {
                    if (this.creep.pos.getRangeTo(this.target) > 3) {
                        moveTarget = this.target;
                    }
                }
            }
        }

        if (this.task === "charge") {
            if (!moveTarget && (this.isHome || this.atWork) && !this.Room.storage) {
                if (!moveTarget && this.Room.containers.length > 0) {
                    let container = this.creep.pos.findClosestByRange(this.Room.containers);
                    if (container && container.store.energy > 0) {
                        moveTarget = container;
                    }
                }

                if (!moveTarget && this.Room.sources.length > 0) {
                    let source = this.creep.pos.findClosestByRange(this.Room.sources);
                    if (source) {
                        moveTarget = source;
                    }
                }
            }

            if (!moveTarget && !this.isHome) {
                moveTarget = this.moveToRoom(this.HomeRoom.name, false);
            }

            if (!moveTarget && this.Room.storage) {
                let storage = this.Room.storage;
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

    findTarget() {
        if (Game.time % 3 === 0) {
            if (this.Room.constructionSites.length > 0) {
                for (let site of this.Room.constructionSites) {
                    if (this.Room.reserve(site.id, this.job, this.name)) {
                        return site;
                    }
                }
            }
        }

        if (this.Room.repairs.length > 0) {
            for (let repairs of this.Room.repairs) {
                if (this.Room.reserve(repairs.id, this.job, this.name)) {
                    return repairs;
                }
            }
        }

        return null;
    }
}

module.exports = CreepBuilder;
