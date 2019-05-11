'use strict';

let C = require('./constants');

let CreepWorker = require('./Creep.Worker');

/**
 * Wrapper class for creeps with logic for a dismantler.
 * Primary purpose of these creeps are to break down both friendly and hostile structures.
 */
class CreepDismantler extends CreepWorker {
    /**
     * Gets the creep job target. 
     */
    get target () {
        if (this._cache.target === undefined) {
            if (this._mem.work.target !== undefined) {
                this._cache.target = Game.getObjectById(this._mem.work.target);
            }
            else {
                this._cache.target = null;
            }
        }
        return this._cache.target;
    }

    /**
     * Sets the creep job target. 
     */
    set target (obj) {
        if (obj !== null) {
            this._cache.target = obj;
            this._mem.work.target = obj.id;
        }
        else {
            this._cache.target = null;
            delete this._mem.work.target;
        }
    }

    /**
     * Perform dismantler related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work () {
        if (!this.atWork) {
            this.moveToRoom(this._mem.rooms.work);
            return true;
        }

        if (this.target === null) {
            this.target = this.findTarget();
        }

        if (this.target !== null) {
            if (this.pos.isNearTo(this.target)) {
                this.dismantle(this.target);
            }
        }

        if (this.load >= this.capacity) {
            this.drop(RESOURCE_ENERGY);
        }

        if (this.target !== null) {
            if (!this.pos.isNearTo(this.target)) {
                this.moveTo(this.target);
            }
        }

        return true;
    }

    findTarget () {
        if (!this.atWork) {
            return null;
        }

        if (this.room.flags[COLOR_GREY] !== undefined) {
            for (const flag of this.room.flags[COLOR_GREY]) {
                let structures = flag.pos.lookFor(LOOK_STRUCTURES);
                if (structures.length > 0) {
                    return structures[0];
                }
            }
        }

        if (this.room.isMine) {
            // Do not dismantle random structures in owned rooms.
            return null;
        }

        if (this.room.ramparts.length > 0) {
            return this.getClosestByRange(this.room.ramparts);
        }

        if (this.room.towers.length > 0) {
            return this.getClosestByRange(this.room.towers, (x) => x.energy === 0);
        }

        if (this.room.spawns.length > 0) {
            return this.getClosestByRange(this.room.spawns, (x) => x.energy === 0);
        }

        if (this.room.extensions.length > 0) {
            return this.getClosestByRange(this.room.extensions, (x) => x.energy === 0);
        }

        if (this.room.links.all.length > 0) {
            return this.getClosestByRange(this.room.links.all, (x) => x.energy === 0);
        }

        if (this.room.labs.all.length > 0) {
            return this.getClosestByRange(this.room.labs.all, (x) => x.energy === 0 && x.mineralAmount === 0);
        }

        if (this.room.storage !== null && _.sum(this.room.storage.store) === 0) {
            return this.room.storage;
        }

        if (this.room.terminal !== null && _.sum(this.room.terminal.store) === 0) {
            return this.room.terminal;
        }

        if (this.room.extractor !== null) {
            return this.room.extractor;
        }

        if (this.room.observer !== null) {
            return this.room.observer;
        }

        if (this.room.powerSpawn !== null && this.room.powerSpawn.energy === 0 && this.room.powerSpawn.power === 0) {
            return this.room.powerSpawn;
        }

        if (this.room.nuker !== null && this.room.nuker.energy === 0 && this.room.nuker.ghodium === 0) {
            return this.room.nuker;
        }

        if (this.room.walls.length > 0) {
            return this.getClosestByRange(this.room.walls);
        }

        return null;
    }

    /**
     * This function is a wrapper for creep.dismantle().
     * It helps keep track of the amount of cargo currently in the creep.
     * 
     * @param {Structure} target The structure being dismantled.
     */
    dismantle (target) {
        if (this._performedWork.dismantle) {
            return ERR_BUSY;
        }

        let res = this._creep.dismantle(target);
        if (res === OK) {
            this._energy = Math.min(this._capacity, this._energy + Math.floor(this._baseStrength * C.DISMANTLE_ENERGY_GAIN));
            this._performedWork.dismantle = true;
        }
        return res;
    }
}

module.exports = CreepDismantler;
