'use strict';

const C = require('./constants');

const CreepWorker = require('./Creep.Worker');

/**
 * Wrapper class for creeps with logic for a linker.
 * Primary purpose of these creeps are to manage the linking nettwork in the room.
 */
class CreepLinker extends CreepWorker {
    /**
     * Perform linker related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work () {
        if (!this.atWork) {
            this.moveTo(this.moveToRoom(this._mem.rooms.work, false));
            return true;
        }

        const storage = this.room.storage;
        const storageLink = this.room.links.storage;

        if (!storage || !storageLink) {
            return false;
        }

        if (storageLink.cooldown > 1 || !this.room.links.controller || this.room.links.controller.energyCapacity - this.room.links.controller.energy < C.LINK_MINIMUM_TRANSFER) {
            // Storage link can't send the energy. Remove it with the creep.
            if (this.load === 0) {
                if (storageLink.energy > 0 && this.pos.isNearTo(storageLink)) {
                    this.withdraw(storageLink, RESOURCE_ENERGY);
                }
            }
            else {
                // Empty creep
                if (this.pos.isNearTo(storage)) {
                    this.transfer(storage, RESOURCE_ENERGY);
                }
            }
        }
        else {
            if (this.load === 0) {
                if (this.pos.isNearTo(storage)) {
                    this.withdraw(storage, RESOURCE_ENERGY);
                }
            }
            else {
                if (this.pos.isNearTo(storageLink)) {
                    this.transfer(storageLink, RESOURCE_ENERGY);
                }
            }
        }

        if (!this.pos.isNearTo(storage)) {
            this.moveTo(storage);
        }

        if (!this.pos.isNearTo(storageLink)) {
            this.moveTo(storageLink);
        }

        return true;
    }
}

module.exports = CreepLinker;
