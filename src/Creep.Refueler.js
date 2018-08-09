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
        if (!this.AtWork) {
            this.moveToRoom(this.WorkRoom.name);
            return true;
        }

        if (!this.Room.storage || this.NextCarry > this.EndEnergy) {
            return false;
        }

        if (this.EndEnergy < this.Capacity) {
            if (this.creep.pos.isNearTo(this.Room.storage)) {
                this.withdraw(this.Room.storage, RESOURCE_ENERGY);
            }
        }

        if (this.EndEnergy > 0 && this.Room.towers.length > 0) { 
            // Towers are sorted. The one with less remaining energy first.
            let tower = this.Room.towers[0];
            if (this.creep.pos.isNearTo(tower)) {
                this.transfer(tower, RESOURCE_ENERGY);
            }
        }

        if (this.EndEnergy > 0 && this.Room.Extensions.length > 0) {
            // The extensions array only contains extensions and spawns with space for energy.
            let extensions = this.creep.pos.findInRange(this.Room.Extensions, 1);
            if (extensions.length > 0) {
                this.transfer(extensions[0], RESOURCE_ENERGY);
            }
        }

        let moveTarget = null;

        if (this.EndEnergy > 0) { 
            // Prioritise towers if the room is invaded.
            if (this.Room.state !== C.ROOM_STATE_NORMAL) {
                if (this.Room.towers.length > 0) {
                    for (let tower of this.Room.towers) {
                        if (tower.energy < tower.energyCapacity - 200) {
                            moveTarget = tower;
                            break;
                        }
                    }
                } 
            }

            if (!moveTarget && this.Room.Extensions.length > 0) {
                // All structures in the Extensions array have room for energy. Pick the closest.
                moveTarget = this.creep.pos.findClosestByRange(this.Room.Extensions);
            }

            if (!moveTarget && this.Room.towers.length > 0) {
                for (let tower of this.Room.towers) {
                    if (tower.energy < tower.energyCapacity - 200) {
                        moveTarget = tower;
                        break;
                    }
                }
            }
        }
        else {
            moveTarget = this.Room.storage;
        }

        if (moveTarget) {
            this.moveTo(moveTarget);
        }

        return true;
    }

    mustRenew() {
        return false;
        if (this.creep.ticksToLive > 1000) {
            return false;
        }

        if (this.Room.Spawns.length > 0) {
            let spawns = this.creep.pos.findInRange(this.Room.Spawns, 1);
            if (spawns.length > 0) {
                return true;
            }
        }

        return false;
    }
}

module.exports = CreepRefueler;
