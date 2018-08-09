'use strict';

let C = require('constants');

let CreepWorker = require('Creep.Worker');

/**
 * Wrapper class for creeps with logic for a broker.
 * Primary purpose of these creeps are to move energy between links, storage and terminal.
 */
class CreepBroker extends CreepWorker {   
    /**
     * Initializes a new instance of the CreepBroker class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep) {
        super(creep);
    }
    
    /**
     * Perform broker related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        if (!this.AtWork) {
            this.moveTo(this.moveToRoom(this.WorkRoom.name, false));
            return true;
        }

        let storage = this.Room.storage;
        let storageLink = this.Room.Links.Storage;
        let terminal = this.Room.terminal;

        if (!storage || (!storageLink && !terminal)) {
            this.creep.say("todo?");
            return false;
        }

        let performedWithdraw = false;

        if (this.NextCarry < this.Capacity && !performedWithdraw) {
            if (storageLink && storageLink.energy > 300 && this.creep.pos.isNearTo(storageLink)) {
                if (this.withdraw(storageLink, RESOURCE_ENERGY) === OK ) {
                    performedWithdraw = true;
                }
            }
        }

        if (this.NextCarry < this.Capacity && !performedWithdraw && this.creep.pos.isNearTo(storage)) {
            // Do not move stuff out of the storage if the terminal is full.
            if (terminal && _.sum(terminal.store) < terminal.storeCapacity * 0.9) {
                for (let resourceType in storage.store) {
                    let storeLimit = C.STORAGE_THRESHOLD_MINERAL * 1.1;
                    if (resourceType === RESOURCE_ENERGY) {
                        storeLimit = C.STORAGE_THRESHOLD_ENERGY * 1.1;
                    }

                    if (storage.store[resourceType] > storeLimit) {
                        if (this.withdraw(storage, resourceType) === OK) {
                            performedWithdraw = true;
                            break;
                        }
                    }
                }
            }
        }

        if (terminal && this.NextCarry < this.Capacity && !performedWithdraw && this.creep.pos.isNearTo(terminal)) {
            for (let resourceType in terminal.store) {
                let storeLimit = C.STORAGE_THRESHOLD_MINERAL * 0.9;
                if (resourceType === RESOURCE_ENERGY) {
                    storeLimit = C.STORAGE_THRESHOLD_ENERGY * 0.9;
                }

                // Only reason to withdraw from the terminal would be if the storage is below its threshold.
                if ((storage.store[resourceType] || 0 ) < storeLimit) {
                    if (this.withdraw(terminal, resourceType) === OK) {
                        performedWithdraw = true;
                        break;
                    }
                }
            }
        }

        if (this.NextCarry > 0 && this.creep.pos.isNearTo(storage)) {
            for (let resourceType in this.creep.carry) {
                let storeLimit = C.STORAGE_THRESHOLD_MINERAL * 0.9;
                if (resourceType === RESOURCE_ENERGY) {
                    storeLimit = C.STORAGE_THRESHOLD_ENERGY * 0.9;
                }

                if ((storage.store[resourceType] || 0) < storeLimit) {
                    if (this.transfer(storage, resourceType) === OK) {
                        break;
                    }
                }

                if (terminal && this.creep.pos.isNearTo(terminal)) {
                    if (this.transfer(terminal, resourceType) === OK) {
                        break;
                    }
                }
            }
        }

        if (storage && !this.creep.pos.isNearTo(storage)) {
            this.moveTo(storage);
        }

        if (storageLink && !this.creep.pos.isNearTo(storageLink)) {
            this.moveTo(storageLink);
        }

        if (terminal && !this.creep.pos.isNearTo(terminal)) {
            this.moveTo(terminal);
        }

        return true;
    }
}

module.exports = CreepBroker;
