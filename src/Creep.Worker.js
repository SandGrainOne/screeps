'use strict';

let C = require('constants');

let CreepBase = require('Creep.Base');

/**
 * Wrapper class for creeps with worker related logic.
 */
class CreepWorker extends CreepBase {
    
    /**
     * Initializes a new instance of the CreepWorker class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep) {
        super(creep);
        this.Energy = this.creep.carry.energy;
        this.Carry = _.sum(this.creep.carry);
    }

    /**
     * Gets a value indicating whether the creep is working.
     */
    get IsWorking() {
        return !!this.mem.isworking;
    }

    /**
     * Sets a value indicating whether the creep is working.
     */
    set IsWorking(value) {
        this.mem.isworking = !!value;
    }

    /**
     * Gets a value indicating whether the creep is in the work room.
     */
    get AtWork() {
        return this.Room.Name === this.WorkRoom.Name;
    }

    /**
     * Gets a value indicating whether the creep is in the home room.
     */
    get AtHome() {
        return this.Room.Name === this.HomeRoom.Name;
    }

    get IsRemoteWorker() {
        return this.WorkRoom.Name !== this.HomeRoom.Name;
    }

    /**
     * Perform a retreat if there is an enemy creep in the room or if it is hurt.
     * 
     * @returns {Boolean} true if the retreat was required and the creep is on the move
     */
    retreat() {
        if (!this.AtHome) {
            if (this.Room.State !== C.ROOM_STATE_NORMAL) {
                this.moveHome();
                return true;
            }
            if (this.creep.hits < this.creep.hitsMax) {
                this.moveHome();
                return true;
            }
        }
        return false;
    }

    /**
     * Logic that tries to find a source of stored energy in current room and withdraw as much as possible.
     */
    findStoredEnergy() {
        let links = this.Room.getReceivingLinks();
        if (links && links.length > 0) {
            let link = this.creep.pos.findClosestByPath(links)
            if (link && link.energy >= 200) {
                if (this.creep.withdraw(link, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(link);
                }
                return true;
            }
        }

        let roomStorage = this.Room.Storage;

        if (roomStorage && roomStorage.store[RESOURCE_ENERGY] > 0) {
            if (this.creep.withdraw(roomStorage, RESOURCE_ENERGY) !== OK) {
                this.creep.moveTo(roomStorage);
            }
            return true;
        }
        
        let container = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
            filter: function (structure) { 
                return structure.structureType === STRUCTURE_CONTAINER && (structure.store.energy > 0); 
            } 
        });

        if (container !== null) {
            if (this.creep.withdraw(container, RESOURCE_ENERGY) !== OK) {
                this.creep.moveTo(container);
            }
            return true;
        }
        
        return false;
    }
}

module.exports = CreepWorker;
