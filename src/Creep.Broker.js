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
            this.moveTo(this.moveToRoom(this.WorkRoom.Name, false));
            return true;
        }

        let storage = this.Room.Storage;
        let storageLink = this.Room.Links.Storage;
        let terminal = this.Room.Terminal;

        if (!storage || !storageLink) {
            this.creep.say("todo?");
        }

        if (this.NextCarry < this.Capacity) {
            if (storageLink && storageLink.energy > 0 && this.creep.pos.isNearTo(storageLink)) {
                this.withdraw(storageLink, RESOURCE_ENERGY);
            }
        }

        if (this.NextCarry < this.Capacity) {
            if (storage && storage.store.energy > 500000 && this.creep.pos.isNearTo(storage)) {
                this.withdraw(storage, RESOURCE_ENERGY);
            }
        }

        if (this.NextCarry < this.Capacity) {
            if (terminal && terminal.store.energy > 0 && this.creep.pos.isNearTo(terminal)) {
                this.withdraw(terminal, RESOURCE_ENERGY);
            }
        }

        if (this.NextCarry > 0) {
            if (storage && storage.store.energy < 500000 && this.creep.pos.isNearTo(storage)) {
                this.transfer(storage, RESOURCE_ENERGY);
            }
        }

        if (this.NextCarry > 0) {
            if (terminal && this.creep.pos.isNearTo(terminal)) {
                this.transfer(terminal, RESOURCE_ENERGY);
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
