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
        if (_.isUndefined(this._cache.target)) {
            if (!_.isUndefined(this._mem.work.target)) {
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

        if (this.task === 'collecting') {
            if (_.isNull(this.target)) {
                this.target = this.findTarget();
            }

            if (!_.isNull(this.target)) {
                if (this.pos.isNearTo(this.target)) {
                    this.dismantle(this.target);
                }
            }
        }

        if (this.task === 'delivering') {
            if (this.room.containers.length > 0) {
                let container = this.getFirstInRange(this.room.containers, 3);
                if (!_.isNull(container)) {
                    if (container.hits < container.hitsMax) {
                        this.repair(container);
                    }
                    else if (this.pos.isNearTo(container)) {
                        this.transfer(container, RESOURCE_ENERGY);
                    }
                }
            }
            else {
                this.drop(RESOURCE_ENERGY);
            }
        }

        if (this.load >= this.capacity) {
            this.task = 'delivering';
        }

        if (this.load <= 0) {
            this.task = 'collecting';
        }

        if (this.task === 'collecting') {
            if (!_.isNull(this.target)) {
                if (!this.pos.isNearTo(this.target)) {
                    this.moveTo(this.target);
                }
            }
        }

        if (this.task === 'delivering') {
            if (this.room.containers.length > 0) {
                let container = this.pos.findClosestByRange(this.room.containers);
                if (!this.pos.isNearTo(container)) {
                    this.moveTo(container);
                }
            }
        }

        return true;
    }

    findTarget () {
        if (!this.atWork) {
            return null;
        }

        if (this.room.flags[COLOR_GREY]) {
            for (const flag of this.room.flags[COLOR_GREY]) {
                let structures = flag.pos.lookFor(LOOK_STRUCTURES);
                if (structures.length > 0) {
                    return structures[0];
                }
            }
        }

        if (this.room.isMine) {
            // Do not dismantle random structures in owned roomes.
            return null;
        }

        if (this.room.controller && this.room.controller.reservation && this.room.controller.reservation.username === C.USERNAME) {
            // Do not dismantle random structures in reserved rooms.
            return null;
        }

        if (this.room.ramparts.length > 0) {
            return this.pos.findClosestByRange(this.room.ramparts);
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
