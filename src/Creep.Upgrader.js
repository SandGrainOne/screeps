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
        if (this.AtWork && this.StartEnergy > 0) {
            if (this.Room.isMine) {
                let rangeToController = this.creep.pos.getRangeTo(this.Room.controller);
                if (rangeToController <= 3) {
                    this.upgrade(this.Room.controller);
                }
            }
        }

        if (this.AtHome && this.EndEnergy < this.Capacity) {
            let storage = this.Room.storage;
            if (storage && storage.store.energy > 0 && this.creep.pos.isNearTo(storage)) {
                this.withdraw(storage, RESOURCE_ENERGY);
            }
        }

        if (this.AtWork && this.EndEnergy < this.Capacity) {
            let link = this.Room.Links.Controller;
            if (link && link.energy > 0 && this.creep.pos.isNearTo(link)) {
                let res = this.withdraw(link, RESOURCE_ENERGY);
            }
        }

        if (this.AtWork && this.EndEnergy < this.Capacity) {
            if (this.Room.sources.length > 0) {
                let sources = this.creep.pos.findInRange(this.Room.sources, 1);
                if (sources[0] && this.creep.pos.isNearTo(sources[0])) {
                    this.harvest(sources[0]);
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

        if (this.IsWorking) {
            if (!this.AtWork) {
                this.moveToRoom(this.WorkRoom.name);
            }
            else {
                if (this.Room.isMine) {
                    let rangeToController = this.creep.pos.getRangeTo(this.Room.controller);
                    if (rangeToController > 3) {
                        moveTarget = this.Room.controller;
                    }
                }
                else {
                    return false;
                }
            }
        }
        else {
            if (!this.AtHome) {
                this.moveToRoom(this.HomeRoom.name);
            }
            else {
                if (this.AtWork && this.Room.Links.Controller && this.creep.pos.isNearTo(this.Room.Links.Controller)) {
                    moveTarget = this.Room.Links.Controller;
                }
                else if (this.Room.storage && this.creep.pos.isNearTo(this.Room.storage)) {
                    moveTarget = this.Room.storage;
                }

                if (!moveTarget && this.AtWork) {
                    let link = this.Room.Links.Controller;
                    if (link && link.energy > 0 && !this.creep.pos.isNearTo(link)) {
                        moveTarget = link;
                    }
                }
                if (!moveTarget) {
                    let storage = this.Room.storage;
                    if (storage && storage.store.energy > 0 && !this.creep.pos.isNearTo(storage)) {
                        moveTarget = storage;
                    }
                }
                if (!moveTarget && this.AtWork) {
                    let source = this.creep.pos.findClosestByPath(this.Room.sources);
                    
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

module.exports = CreepUpgrader;
