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
        let performedWork = false;

        if (this.AtWork && !performedWork && this.StartEnergy > 0) {
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
        
        let collectedEnergy = false;

        if (this.AtHome && !collectedEnergy && this.StartEnergy < this.Capacity) {
            let storage = this.Room.Storage;
            if (storage && storage.store.energy > 0 && this.creep.pos.isNearTo(storage)) {
                this.withdraw(storage, RESOURCE_ENERGY);
            }
        }

        if (this.AtWork && !collectedEnergy && this.StartEnergy < this.Capacity) {
            if (this.Room.Resources.Sources.length > 0) {
                let sources = this.creep.pos.findInRange(this.Room.Resources.Sources, 1);
                if (sources[0] && this.creep.pos.isNearTo(sources[0])) {
                    this.harvest(sources[0]);
                }
            }
        }

        if (this.Name === " ") {
            console.log("StartCarry: " + this.StartCarry);
            console.log("EndCarry  : " + this.EndCarry);
        }

        if (this.EndEnergy >= this.Capacity) {
            this.IsWorking = true;
        }

        if (this.EndEnergy <= 0) {
            this.IsWorking = false;
        }

        let moveTarget = null;
        
        if (this.IsWorking) {
            if (!this.AtWork) {
                this.moveToRoom(this.WorkRoom);
            }
            else {
                if (!moveTarget) {
                    if (this.Room.BuildSites.length > 0) {
                        let site = this.creep.pos.findClosestByRange(this.Room.BuildSites);
                        if (site) {
                            if (!this.creep.pos.isNearTo(site)) {
                                moveTarget = site;
                            }
                        }
                    }
                }
                
                if (!moveTarget) {
                    let repairs = this.creep.pos.findClosestByRange(this.Room.Repairs);
                    if (repairs) {
                        if (this.creep.pos.getRangeTo(repairs) > 3) {
                            moveTarget = repairs;
                        }
                    }
                }
            }
        }
        else {
            if (!this.AtHome) {
                this.moveToRoom(this.HomeRoom);
            }
            else {
                if (!moveTarget) {
                    let storage = this.Room.Storage;
                    if (storage && storage.store.energy > 0 && !this.creep.pos.isNearTo(storage)) {
                        moveTarget = storage;
                    }
                }
                if (!moveTarget) {
                    let source = this.creep.pos.findClosestByPath(this.Room.Resources.Sources);
                    if (source && !this.creep.pos.isNearTo(source)) {
                        moveTarget = source;
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

module.exports = CreepBuilder;
