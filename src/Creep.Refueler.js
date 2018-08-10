'use strict';

let C = require('constants');

let CreepWorker = require('Creep.Worker');

/**
 * Wrapper class for creeps with logic for a refueler.
 * Primary purpose of these creeps are to keep the towers, spawn and extensions stocked with energy in that order.
 */
class CreepRefueler extends CreepWorker {   
    /**
     * Initializes a new instance of the CreepRefueler class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep) {
        super(creep);
    }
    
    /**
     * Perform refueling related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        if (!this.atWork) {
            this.moveToRoom(this.WorkRoom.name);
            return true;
        }

        if (!this.room.storage || this.load > this.energy) {
            return false;
        }

        if (this.energy < this.capacity) {
            if (this.pos.isNearTo(this.room.storage)) {
                this.withdraw(this.room.storage, RESOURCE_ENERGY);
            }
        }

        if (this.energy > 0 && this.room.towers.length > 0) { 
            // Towers are sorted. The one with less remaining energy first.
            let tower = this.room.towers[0];
            if (this.pos.isNearTo(tower)) {
                this.transfer(tower, RESOURCE_ENERGY);
            }
        }

        if (this.energy > 0 && this.room.extensions.length > 0) {
            // The extensions array only contains extensions and spawns with space for energy.
            let extension = this.getFirstInRange(this.room.extensions, 1);
            if (extension) {
                this.transfer(extension, RESOURCE_ENERGY);
            }
        }

        if (this.energy > 0 && this.room.nuker !== null) {
            if (this.pos.isNearTo(this.room.nuker)) {
                this.transfer(this.room.nuker, RESOURCE_ENERGY);
            }
        }

        if (this.energy > 0 && this.room.terminal) {
            if (this.room.terminal.store.energy < C.TERMINAL_THRESHOLD_ENERGY - 5000 && this.room.storage.store.energy > 200000) {
                if (this.pos.isNearTo(this.room.terminal)) {
                    this.transfer(this.room.terminal, RESOURCE_ENERGY);
                }
            }
        }

        let moveTarget = null;

        if (this.energy > 0) { 
            // Prioritise towers if the room is invaded.
            if (this.room.state !== C.ROOM_STATE_NORMAL) {
                if (this.room.towers.length > 0) {
                    for (let tower of this.room.towers) {
                        if (tower.energy < tower.energyCapacity - 200) {
                            moveTarget = tower;
                            break;
                        }
                    }
                } 
            }

            if (!moveTarget && this.room.extensions.length > 0) {
                // All structures in the extensions array have room for energy. Pick the closest.
                moveTarget = this.pos.findClosestByRange(this.room.extensions);
            }

            if (!moveTarget && this.room.terminal) {
                if (this.room.terminal.store.energy < 40000 && this.room.storage.store.energy > 200000) {
                    moveTarget = this.room.terminal;
                }
            }

            if (!moveTarget && this.room.towers.length > 0) {
                for (let tower of this.room.towers) {
                    if (tower.energy < tower.energyCapacity - 200) {
                        moveTarget = tower;
                        break;
                    }
                }
            }

            if (!moveTarget && this.room.nuker !== null) {
                if (this.room.nuker.energy < this.room.nuker.energyCapacity) {
                    moveTarget = this.room.nuker;
                }
            }
        }
        else {
            moveTarget = this.room.storage;
        }

        if (moveTarget) {
            this.moveTo(moveTarget);
        }

        return true;
    }

    /**
     * Analyze the room and identify the appropriate number of refuelers as well as their body.
     * 
     * @param room - An instance of a visible smart room.
     */
    static defineJob(room) {
        // Refuelers operate in owned rooms with a storage.
        if (!room.isMine || !room.storage) {
            return;
        }

        return;

        // Might add work parts for road repairs?
        let workParts = 0;

        let factor = room.extensions[0].energyCapacity / CARRY_CAPACITY;
        let carryParts = 1;

        // Make it an even number of parts before adding move.
        carryParts = carryParts + (workParts + carryParts) % 2;

        // Should have 1 move part for every two other parts.
        let moveParts = Math.max((workParts + carryParts) / 2, 2);

        let job = {};
        job.number = 2;
        job.body = Array(workParts).fill(WORK).concat(Array(carryParts).fill(CARRY)).concat(Array(moveParts).fill(MOVE));

        return job;
    }
}

module.exports = CreepRefueler;
