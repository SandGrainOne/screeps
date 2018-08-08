'use strict';

let CreepWorker = require('Creep.Worker');

/**
 * Wrapper class for creeps with logic for an upgrader.
 * Primary purpose of these creeps are to perform upgrading on an owned controller.
 */
class CreepUpgrader extends CreepWorker {   
    /**
     * Initializes a new instance of the CreepUpgrader class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep) {
        super(creep);
    }
    
    /**
     * Perform upgrading related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        if (this.Task === "charging") {
            if (this.creep.carry.energy < this.creep.carryCapacity)  {
                if (this.moveHome()) {
                    if (!this.findStoredEnergy()) {
                        let source = this.creep.pos.findClosestByPath(FIND_SOURCES);
                        
                        if (source !== null) {
                            if (this.creep.harvest(source) === ERR_NOT_IN_RANGE) {
                                this.creep.moveTo(source);
                            }
                        }
                    }
                }
            }
            else {
                this.Task = "upgrading";
            }
        }
        else {
            if (this.creep.carry.energy > 0)  {
                if (this.moveOut()) {
                    let target = this.creep.room.controller;
                
                    if (this.creep.upgradeController(target) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(target);
                    }
                }
            }
            else {
                this.Task = "charging";
            }
        }
        
        return true;
    }
}

module.exports = CreepUpgrader;
