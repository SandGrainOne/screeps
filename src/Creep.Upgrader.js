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
        if (this.atWork && this.energy > 0) {
            if (this.room.isMine) {
                let rangeToController = this.pos.getRangeTo(this.room.controller);
                if (rangeToController <= 3) {
                    this.upgrade(this.room.controller);
                }
            }
        }

        if (this.isHome && this.energy < this.capacity) {
            let storage = this.room.storage;
            if (storage && storage.store.energy > 0 && this.pos.isNearTo(storage)) {
                this.withdraw(storage, RESOURCE_ENERGY);
            }
        }

        if (this.atWork && this.energy < this.capacity) {
            let link = this.room.Links.Controller;
            if (link && link.energy > 0 && this.pos.isNearTo(link)) {
                let res = this.withdraw(link, RESOURCE_ENERGY);
            }
        }
        
        if (this.atWork && this.energy < this.capacity) {
            if (this.room.containers.length > 0) {
                let container = this.getFirstInRange(this.room.containers, 1);
                if (container) {
                    this.withdraw(container, RESOURCE_ENERGY);
                }
            }
        }
        
        if (this.atWork && this.energy < this.capacity) {
            if (this.room.sources.length > 0) {
                let source = this.getFirstInRange(this.room.sources, 1);
                if (source) {
                    this.harvest(source);
                }
            }
        }

        if (this.load >= this.capacity) {
            this.isWorking = true;
        }

        if (this.load <= 0) {
            this.isWorking = false;
        }

        let moveTarget = null;

        if (this.isWorking) {
            if (!this.atWork) {
                this.moveToRoom(this.WorkRoom.name);
            }
            else {
                if (this.room.isMine) {
                    let rangeToController = this.pos.getRangeTo(this.room.controller);
                    if (rangeToController > 3) {
                        moveTarget = this.room.controller;
                    }
                }
                else {
                    return false;
                }
            }
        }
        else {
            if (!this.isHome) {
                this.moveToRoom(this.HomeRoom.name);
            }
            else {
                if (this.atWork && this.room.Links.Controller && this.pos.isNearTo(this.room.Links.Controller)) {
                    moveTarget = this.room.Links.Controller;
                }
                else if (this.room.storage && this.pos.isNearTo(this.room.storage)) {
                    moveTarget = this.room.storage;
                }

                if (!moveTarget && this.atWork) {
                    let link = this.room.Links.Controller;
                    if (link && link.energy > 0 && !this.pos.isNearTo(link)) {
                        moveTarget = link;
                    }
                }
                if (!moveTarget) {
                    let storage = this.room.storage;
                    if (storage && storage.store.energy > 0 && !this.pos.isNearTo(storage)) {
                        moveTarget = storage;
                    }
                }
                if (!moveTarget && this.atWork) {
                    let source = this.pos.findClosestByPath(this.room.sources);
                    
                    if (source && !this.pos.isNearTo(source)) {
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
