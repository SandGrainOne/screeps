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
        let energy = this.creep.carry.energy;
        let workParts = this.creep.getActiveBodyparts(WORK);

        if (energy > 0) {
            let controller = this.Room.Controller.my ? this.Room.Controller : null;
            if (controller) {
                let rangeToController = this.creep.pos.getRangeTo(controller);
                if (rangeToController <= 3) {
                    let upgradeResult = this.creep.upgradeController(controller);
                    if (upgradeResult === OK) {
                        energy = energy - workParts;
                    }
                }
            }
        }

        if (energy < this.creep.carryCapacity) {
            let storage = this.Room.Storage;
            if (storage && storage.store.energy > 0 && this.creep.pos.isNearTo(storage)) {
                let withdrawResult = this.creep.withdraw(storage, RESOURCE_ENERGY);
                if (withdrawResult === OK) {
                    let energyStored = storage.store.energy;
                    let space = this.creep.carryCapacity - energy;
                    energy = energy + Math.min(space, energyStored);
                }
            }
        }

        if (energy < this.creep.carryCapacity) {
            let link = this.Room.Links.Controller;
            if (link && link.energy > 0 && this.creep.pos.isNearTo(link)) {
                let withdrawResult = this.creep.withdraw(link, RESOURCE_ENERGY);
                if (withdrawResult === OK) {
                    let energyStored = link.energy;
                    let space = this.creep.carryCapacity - energy;
                    energy = energy + Math.min(space, energyStored);
                }
            }
        }

        if (energy < this.creep.carryCapacity) {
            // Look for a source? Needed in the very start of a new room before storage and links.
            // Look for other containers? Probably not. First container should always be storage.
        }

        if (energy >= this.creep.carryCapacity) {
            this.IsWorking = true;
        }

        if (energy <= 0) {
            this.IsWorking = false;
        }

        let moveTarget = null;
        if (this.IsWorking) {
            let controller = this.WorkRoom.Controller.my ? this.WorkRoom.Controller : null;
            if (controller) {
                let rangeToController = this.creep.pos.getRangeTo(controller);
                if (rangeToController > 3) {
                    moveTarget = controller;
                }
            }
            else {
                this.creep.say("contrler!?");
            }
        }
        else {
            let rangeToStorage = this.creep.pos.getRangeTo(this.HomeRoom.Storage);
        }

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
            }
            else {
                this.Task = "charging";
            }
        }

        if (moveTarget) {
            this.moveTo(moveTarget);
        }
        
        return true;
    }
}

module.exports = CreepUpgrader;
