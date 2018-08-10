'use strict';

let CreepWorker = require('./Creep.Worker');

/**
 * Wrapper class for creeps with logic for a broker.
 * Primary purpose of these creeps are to move energy between links, storage and terminal.
 */
class CreepBroker extends CreepWorker {
    /**
     * Perform broker related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work () {
        if (!this.atWork) {
            this.moveTo(this.moveToRoom(this.WorkRoom.name, false));
            return true;
        }

        let storage = this.room.storage;
        let terminal = this.room.terminal;

        if (!storage || !terminal) {
            return false;
        }

        let performedWithdraw = false;

        if (this.load < this.capacity && !performedWithdraw && this.pos.isNearTo(storage)) {
            // Do not move stuff out of the storage if the terminal is full.
            if (terminal && _.sum(terminal.store) < terminal.storeCapacity * 0.9) {
                for (let resourceType in storage.store) {
                    // Taking energy from the storage is handled by refuelers.
                    if (resourceType === RESOURCE_ENERGY) {
                        continue;
                    }

                    // Moving all resources except energy to the terminal.
                    if (storage.store[resourceType] > 0) {
                        if (this.withdraw(storage, resourceType) === OK) {
                            performedWithdraw = true;
                            break;
                        }
                    }
                }
            }
        }

        if (this.load > 0 && this.pos.isNearTo(storage)) {
            for (let resourceType in this.carry) {
                if (resourceType === RESOURCE_ENERGY) {
                    if (this.transfer(storage, resourceType) === OK) {
                        break;
                    }
                }

                // Moving energy to the terminal is handled by the refuelers.
                if (resourceType !== RESOURCE_ENERGY) {
                    if (terminal && this.pos.isNearTo(terminal)) {
                        if (this.transfer(terminal, resourceType) === OK) {
                            break;
                        }
                    }
                }
            }
        }

        if (storage && !this.pos.isNearTo(storage)) {
            this.moveTo(storage);
        }

        if (terminal && !this.pos.isNearTo(terminal)) {
            this.moveTo(terminal);
        }

        return true;
    }
}

module.exports = CreepBroker;
