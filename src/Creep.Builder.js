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
            if (this.Room.BuildSites.length > 0) {
                for (let buildSite of this.Room.BuildSites) {
                    let rangeToBuildSite = this.creep.pos.getRangeTo(buildSite);
                    if (rangeToBuildSite <= 3) {
                        if (this.build(buildSite) === OK) {
                            performedWork = true;
                            break;
                        }
                    }
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
            let storage = this.Room.Storage;
            if (storage && storage.store.energy > 0 && this.creep.pos.isNearTo(storage)) {
                this.withdraw(storage, RESOURCE_ENERGY);
            }

            if (this.Room.Containers.length > 0) {
                let containers = this.creep.pos.findInRange(this.Room.Containers, 1);
                if (containers.length > 0) {
                    this.withdraw(containers[0], RESOURCE_ENERGY);
                }
            }

            if (this.Room.Resources.Sources.length > 0) {
                let sources = this.creep.pos.findInRange(this.Room.Resources.Sources, 1);
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

            if (!moveTarget && this.Room.BuildSites.length > 0) {
                let site = this.creep.pos.findClosestByRange(this.Room.BuildSites);
                if (site) {
                    this.mem.buildTargetId = site.id;
                    moveTarget = site;
                    if (this.creep.pos.getRangeTo(site) > 3) {
                        moveRequired = true;
                    }
                }
            }

            if (!moveTarget && this.Room.Repairs.length > 0) {
                let repairs = this.creep.pos.findClosestByRange(this.Room.Repairs);
                if (repairs) {
                    this.mem.repairTargetId = repairs.id;
                    moveTarget = repairs;
                    if (this.creep.pos.getRangeTo(repairs) > 3) {
                        moveRequired = true;
                    }
                }
            }
        }
        else {

            if (!this.Room.Storage && (this.AtHome || this.AtWork)) {
                if (!moveTarget && this.Room.Containers.length > 0) {
                    let container = this.creep.pos.findClosestByRange(this.Room.Containers);
                    if (container && container.store.energy > 0) {
                        moveTarget = container;
                        if (!this.creep.pos.isNearTo(container)) {
                            moveRequired = true;
                        }
                    }
                }

                if (!moveTarget && this.Room.Resources.Sources.length > 0) {
                    let source = this.creep.pos.findClosestByRange(this.Room.Resources.Sources);
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

            if (!moveTarget && this.Room.Storage) {
                let storage = this.Room.Storage;
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
