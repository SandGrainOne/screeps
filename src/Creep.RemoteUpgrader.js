'use strict';

let CreepWorker = require('Creep.Worker');

/**
 * Wrapper class for creeps with logic for an upgrader.
 */
class CreepRemoteUpgrader extends CreepWorker {   
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
        if (this.Task === "harvesting") {
            if (this.creep.carry.energy < this.creep.carryCapacity)  {
                if (this.Room.Name !== this.HomeRoom) {
                    let exitDir = this.Room.room.findExitTo(this.HomeRoom);
                    let exit = this.creep.pos.findClosestByRange(exitDir);
                    this.creep.moveTo(exit);
                }
                else {
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
                if (this.Room.Name !== this.RemoteRoom) {
                    let exitDir = this.Room.room.findExitTo(this.RemoteRoom);
                    let exit = this.creep.pos.findClosestByRange(exitDir);
                    this.creep.moveTo(exit);
                }
                else {
                    let target = this.creep.room.controller;
                    if (this.creep.upgradeController(target) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(target);
                    }
                }
            }
            else {
                this.Task = "harvesting";
            }
        }
        
        return true;
    }
}

module.exports = CreepRemoteUpgrader;
