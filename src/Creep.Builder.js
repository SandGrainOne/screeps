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

        //if (this.name === "Eva") {
            // TODO: Ensure that the creep carry nothing but energy?

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
        /*}

        if (this.atWork && this.energy > 0) {
            let performedWork = false;
            if (this.Room.constructionSites.length > 0) {
                for (let site of this.Room.constructionSites) {
                    let rangeToSite = this.creep.pos.getRangeTo(site);
                    if (rangeToSite <= 3) {
                        if (this.build(site) === OK) {
                            performedWork = true;
                            break;
                        }
                    }
                }
            }

            if (!performedWork) {
                let containers = this.creep.pos.findInRange(FIND_STRUCTURES, 3, { 
                    filter: function (s) { 
                        return (s.structureType === STRUCTURE_CONTAINER) && (s.hits < s.hitsMax); 
                    } 
                });

                if (containers.length > 0) {
                    this.repair(containers[0]);
                    performedWork = true;
                } 
            }

            if (!performedWork) {
                let roads = this.creep.pos.findInRange(FIND_STRUCTURES, 3, { 
                    filter: function (s) { 
                        return s.structureType === STRUCTURE_ROAD && (s.hits < s.hitsMax); 
                    } 
                });

                if (roads.length > 0) {
                    this.repair(roads[0]);
                    performedWork = true;
                } 
            }
            
            if (!performedWork && this.Room.Repairs.length > 0) {
                for (let repairs of this.Room.Repairs) {
                    let rangeToRepairs = this.creep.pos.getRangeTo(repairs);
                    if (rangeToRepairs <= 3) {
                        if (this.repair(repairs) === OK) {
                            performedWork = true;
                            break;
                        }
                    }
                }
            }
        }

        if (this.load < this.capacity) {
            let storage = this.Room.storage;
            if (storage && storage.store.energy > 0 && this.creep.pos.isNearTo(storage)) {
                this.withdraw(storage, RESOURCE_ENERGY);
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
                    let res = this.harvest(sources[0]);
                }
            }
        }

        if (this.load >= this.capacity) {
            this.isWorking = true;
        }

        if (this.load <= 0) {
            this.isWorking = false;
        }

        if (this.isWorking) {

            if (!moveTarget && !this.atWork) {
                moveTarget = this.moveToRoom(this.WorkRoom.name, false);
                moveRequired = true;
            }

            if (!moveTarget && this.Room.constructionSites.length > 0) {
                let site = this.creep.pos.findClosestByRange(this.Room.constructionSites);
                if (site) {
                    moveTarget = site;
                    if (this.creep.pos.getRangeTo(site) > 3) {
                        moveRequired = true;
                    }
                }
            }

            if (!moveTarget) {
                let container = this.creep.pos.findClosestByRange(FIND_STRUCTURES, { 
                    filter: function (s) { 
                        return s.structureType === STRUCTURE_CONTAINER && s.hits < s.hitsMax; 
                    } 
                });

                if (container) {
                    moveTarget = container;
                    if (this.creep.pos.getRangeTo(container) > 3) {
                        moveRequired = true;
                    }
                } 
            }

            if (!moveTarget) {
                let road = this.creep.pos.findClosestByRange(FIND_STRUCTURES, { 
                    filter: function (s) { 
                        return s.structureType === STRUCTURE_ROAD && s.hits < s.hitsMax; 
                    } 
                });

                if (road) {
                    moveTarget = road;
                    if (this.creep.pos.getRangeTo(road) > 3) {
                        moveRequired = true;
                    }
                } 
            }
        }
        else {

            if (!this.Room.storage && (this.isHome || this.atWork)) {
                if (!moveTarget && this.Room.containers.length > 0) {
                    let container = this.creep.pos.findClosestByRange(this.Room.containers);
                    if (container && container.store.energy > 0) {
                        moveTarget = container;
                        if (!this.creep.pos.isNearTo(container)) {
                            moveRequired = true;
                        }
                    }
                }

                if (!moveTarget && this.Room.sources.length > 0) {
                    let source = this.creep.pos.findClosestByRange(this.Room.sources);
                    if (source) {
                        moveTarget = source;
                        if (!this.creep.pos.isNearTo(source)) {
                            moveRequired = true;
                        }
                    }
                }
            }

            if (!moveTarget && !this.isHome) {
                moveTarget = this.moveToRoom(this.HomeRoom.name, false);
                moveRequired = true;
            }

            if (!moveTarget && this.Room.storage) {
                let storage = this.Room.storage;
                if (storage && storage.store.energy > 0) {
                    moveTarget = storage;
                    if (!this.creep.pos.isNearTo(storage)) {
                        moveRequired = true;
                    }
                }
            }
        }

        if (moveRequired && moveTarget) {
            this.moveTo(moveTarget);
        }

        return true;*/
    }

    findTarget() {
        if (Game.time % 2 === 0) {
            if (this.Room.constructionSites.length > 0) {
                for (let site of this.Room.constructionSites) {
                    if (this.Room.reserve(site.id, this.job, this.name)) {
                        return site;
                    }
                }
            }
        }

        if (this.Room.Repairs.length > 0) {
            for (let repairs of this.Room.Repairs) {
                if (this.Room.reserve(repairs.id, this.job, this.name)) {
                    return repairs;
                }
            }
        }

        return null;
    }
}

module.exports = CreepBuilder;
