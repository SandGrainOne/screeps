'use strict';

let CreepWorker = require('./Creep.Worker');

/**
 * Wrapper class for creeps with logic for a scavenger.
 * Primary purpose of these creeps are to scavenger the remains of the dead.
 */
class CreepScavenger extends CreepWorker {
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
        if (!_.isNull(obj)) {
            this._cache.target = obj;
            this._mem.work.target = obj.id;
        }
        else {
            this._cache.target = null;
            delete this._mem.work.target;
        }
    }

    /**
     * Perform scavenger related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work () {
        if (this.isRemoting && this.atWork && this.load < this.capacity) {
            if (_.isNull(this.target)) {
                this.target = this.findTarget();
            }

            if (!_.isNull(this.target)) {
                if (this.pos.isNearTo(this.target)) {
                    let resourceType = this.selectResourceType(this.target);
                    let result = this.withdraw(this.target, resourceType);
                    if (result === ERR_NOT_ENOUGH_RESOURCES) {
                        this.target = null;
                    }
                }
            }
        }

        if (this.isRemoting && this.isHome && this.load > 0) {
            if (this.room.containers.length > 0) {
                let container = this.getFirstInRange(this.room.containers, 1);
                if (container) {
                    for (let resourceType in this.carry) {
                        if (this.transfer(container, resourceType) === OK) {
                            break;
                        }
                    }
                }
            }
            if (this.energy > 0 && this.room.links.inputs.length > 0) {
                let link = this.getFirstInRange(this.room.links.inputs, 1);
                if (link) {
                    if (link.energy < link.energyCapacity) {
                        this.transfer(link, RESOURCE_ENERGY);
                    }
                }
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
            else if (!this.atWork) {
                this.moveToRoom(this._mem.rooms.work);
            }
        }

        if (this.task === 'delivering') {
            if (!this.isHome) {
                this.moveToRoom(this._mem.rooms.home);
            }
            else {
                let moveTarget = null;
                let rangeToTarget = Infinity;
                if (this.room.containers.length > 0) {
                    moveTarget = this.pos.findClosestByRange(this.room.containers);
                    rangeToTarget = this.pos.getRangeTo(moveTarget);
                }
                if (this.energy > 0 && this.energy === this.load && this.room.links.inputs.length > 0) {
                    let link = this.pos.findClosestByRange(this.room.links.inputs);
                    let rangeToLink = this.pos.getRangeTo(link);
                    if (rangeToLink <= rangeToTarget) {
                        moveTarget = link;
                        rangeToTarget = rangeToLink;
                    }
                }
                this.moveTo(moveTarget);
            }
        }

        return true;
    }

    findTarget () {
        if (!this.atWork || this.isMine) {
            return null;
        }

        if (this.room.towers.length > 0) {
            let tower = this.getClosestByRange(this.room.towers, (x) => x.energy > 0);
            if (!_.isNull(tower)) {
                return tower;
            }
        }

        if (this.room.spawns.length > 0) {
            let spawn = this.getClosestByRange(this.room.spawns, (x) => x.energy > 0);
            if (!_.isNull(spawn)) {
                return spawn;
            }
        }

        if (this.room.extensions.length > 0) {
            let extension = this.getClosestByRange(this.room.extensions, (x) => x.energy > 0);
            if (!_.isNull(extension)) {
                return extension;
            }
        }

        if (!_.isNull(this.room.storage) && _.sum(this.room.storage.store) > 0) {
            return this.room.storage;
        }

        if (!_.isNull(this.room.terminal) && _.sum(this.room.terminal.store) > 0) {
            return this.room.terminal;
        }

        if (!_.isNull(this.room.powerSpawn) && this.room.powerSpawn.energy > 0) {
            return this.room.powerSpawn;
        }

        if (this.room.labs.all.length > 0) {
            let lab = this.getClosestByRange(this.room.labs.all, (x) => x.energy > 0 || x.mineralAmount > 0);
            if (!_.isNull(lab)) {
                return lab;
            }
        }

        if (this.room.links.all.length > 0) {
            let link = this.getClosestByRange(this.room.links.all, (x) => x.energy > 0);
            if (!_.isNull(link)) {
                return link;
            }
        }

        return null;
    }

    selectResourceType (target) {
        if (target.store !== undefined) {
            // Containers, Storage, Terminal, etc
            for (let resourceType in target.store) {
                if (target.store[resourceType] > 0) {
                    return resourceType;
                }
            }
        }
        else if (target.power !== undefined) {
            if (target.power > 0) {
                return RESOURCE_POWER;
            }
        }
        else if (target.mineralType !== undefined && target.mineralType !== null) {
            return target.mineralType;
        }
        return RESOURCE_ENERGY;
    }

    /**
     * Analyze the room and identify the appropriate number of scavengers as well as their body.
     * 
     * @param room - An instance of a visible smart room.
     */
    static defineJob (room) {
    }
}

module.exports = CreepScavenger;
