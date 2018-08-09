'use strict';

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
    }
    
    /**
     * Perform building and repair related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        if (this.AtWork && this.StartEnergy > 0) {
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

        if (this.NextCarry < this.Capacity) {
            let storage = this.Room.storage;
            if (storage && storage.store.energy > 0 && this.creep.pos.isNearTo(storage)) {
                this.withdraw(storage, RESOURCE_ENERGY);
            }

            if (this.Room.containers.length > 0) {
                let containers = this.creep.pos.findInRange(this.Room.containers, 1);
                if (containers.length > 0) {
                    this.withdraw(containers[0], RESOURCE_ENERGY);
                }
            }

            if (this.Room.sources.length > 0) {
                let sources = this.creep.pos.findInRange(this.Room.sources, 1);
                if (sources[0] && this.creep.pos.isNearTo(sources[0])) {
                    let res = this.harvest(sources[0]);
                }
            }
        }

        if (this.NextCarry >= this.Capacity) {
            this.IsWorking = true;
        }

        if (this.NextCarry <= 0) {
            this.IsWorking = false;
        }

        let moveTarget = null;
        let moveRequired = false;
        
        if (this.IsWorking) {

            if (!moveTarget && !this.AtWork) {
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

            if (!this.Room.storage && (this.AtHome || this.AtWork)) {
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

            if (!moveTarget && !this.AtHome) {
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

        return true;
    }
}

module.exports = CreepBuilder;
