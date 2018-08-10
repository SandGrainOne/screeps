'use strict';

let C = require('constants');

let CreepWorker = require('Creep.Worker');

/**
 * Wrapper class for creeps with logic for a linker.
 * Primary purpose of these creeps are to manage the linking nettwork in the room.
 */
class CreepLinker extends CreepWorker {   
    /**
     * Initializes a new instance of the CreepLinker class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep) {
        super(creep);
    }
    
    /**
     * Perform linker related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        if (!this.atWork) {
            this.moveTo(this.moveToRoom(this.WorkRoom.name, false));
            return true;
        }

        let storage = this.Room.storage;
        let storageLink = this.Room.Links.Storage;

        if (!storage || !storageLink) {
            return false;
        }

        let worked = false;

        if (storageLink.cooldown > 1 || !this.Room.Links.Controller) {
            // Move stuff away from storage link. It can't send off the energy on its own.
            if (this.load === 0) {
                if (storageLink.energy > 0 && this.creep.pos.isNearTo(storageLink)) {
                    if (this.withdraw(storageLink, RESOURCE_ENERGY) === OK ) {
                        worked = true;
                    }
                }
            }
            else {
                // Empty creep
                if (this.creep.pos.isNearTo(storage)) {
                    if (this.transfer(storage, RESOURCE_ENERGY) === OK ) {
                        worked = true;
                    }
                }
            }
        }
        else {
            if (this.load === 0) {
                if (this.creep.pos.isNearTo(storage)) {
                    if (this.withdraw(storage, RESOURCE_ENERGY) === OK ) {
                        worked = true;
                    }
                }
            }
            else {
                if (this.creep.pos.isNearTo(storageLink)) {
                    if (this.transfer(storageLink, RESOURCE_ENERGY) === OK ) {
                        worked = true;
                    }
                }
            }
        }

        if (!this.creep.pos.isNearTo(storage)) {
            this.moveTo(storage);
        }

        if (!this.creep.pos.isNearTo(storageLink)) {
            this.moveTo(storageLink);
        }

        return true;
    }
}

module.exports = CreepLinker;
