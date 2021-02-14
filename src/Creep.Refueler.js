'use strict';

const C = require('./constants');

const CreepWorker = require('./Creep.Worker');

/**
 * Wrapper class for creeps with logic for a refueler.
 * Primary purpose of these creeps are to keep the towers, spawn and extensions stocked with energy in that order.
 */
class CreepRefueler extends CreepWorker {
    /**
     * Perform refueling related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work () {
        if (!this.atWork) {
            this.moveToRoom(this._mem.rooms.work);
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
            const tower = this.getFirstInRange(this.room.towers, 1, (x) => x.energy < x.energyCapacity - 200);
            if (tower !== null) {
                this.transfer(tower, RESOURCE_ENERGY);
            }
        }

        if (this.energy > 0 && this.room.spawns.length > 0) {
            const spawn = this.getFirstInRange(this.room.spawns, 1, (x) => x.energy < x.energyCapacity);
            if (spawn !== null) {
                this.transfer(spawn, RESOURCE_ENERGY);
            }
        }

        if (this.energy > 0 && this.room.extensions.length > 0) {
            const extension = this.getFirstInRange(this.room.extensions, 1, (x) => x.energy < x.energyCapacity);
            if (extension !== null) {
                this.transfer(extension, RESOURCE_ENERGY);
            }
        }

        if (this.energy > 0 && this.room.powerSpawn !== null) {
            if (this.pos.isNearTo(this.room.powerSpawn)) {
                this.transfer(this.room.powerSpawn, RESOURCE_ENERGY);
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
                    moveTarget = this.getClosestByRange(this.room.towers, (x) => x.energy < x.energyCapacity - 200);
                }
            }

            if (!moveTarget && this.room.spawns.length > 0) {
                moveTarget = this.getClosestByRange(this.room.spawns, (x) => x.energy < x.energyCapacity);
            }

            if (!moveTarget && this.room.extensions.length > 0) {
                moveTarget = this.getClosestByRange(this.room.extensions, (x) => x.energy < x.energyCapacity);
            }

            if (!moveTarget && this.room.terminal) {
                if (this.room.terminal.store.energy < 40000 && this.room.storage.store.energy > 200000) {
                    moveTarget = this.room.terminal;
                }
            }

            if (!moveTarget && this.room.towers.length > 0) {
                moveTarget = this.getClosestByRange(this.room.towers, (x) => x.energy < x.energyCapacity - 200);
            }

            if (!moveTarget && this.room.nuker !== null) {
                if (this.room.nuker.energy < this.room.nuker.energyCapacity) {
                    moveTarget = this.room.nuker;
                }
            }

            if (!moveTarget && this.room.powerSpawn !== null) {
                if (this.room.powerSpawn.energy < this.room.powerSpawn.energyCapacity) {
                    moveTarget = this.room.powerSpawn;
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
    static defineJob (room) {
    }
}

module.exports = CreepRefueler;
