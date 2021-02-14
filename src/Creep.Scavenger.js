'use strict';

const CreepWorker = require('./Creep.Worker');

/**
 * Wrapper class for creeps with logic for a scavenger.
 * Primary purpose of these creeps are to scavenger the remains of the dead.
 */
class CreepScavenger extends CreepWorker {
    /**
     * Perform scavenger related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work () {
        if (this.target === null) {
            this.target = this.findTarget();
        }

        if (this.target !== null && this.target.isFake && this.atWork) {
            // A fake target in a visible room. Find another target.
            this.target = null;
        }

        if (this.atWork && this.load < this.capacity) {
            if (this.target !== null) {
                if (this.pos.isNearTo(this.target)) {
                    const resourceType = this.selectResourceType(this.target);
                    const result = this.withdraw(this.target, resourceType);
                    if (result === ERR_NOT_ENOUGH_RESOURCES) {
                        this.target = null;
                    }
                }
            }
        }

        if (this.isHome && this.load > 0) {
            if (this.room.containers.length > 0) {
                const container = this.getFirstInRange(this.room.containers, 1);
                if (container !== null) {
                    for (const resourceType in this.store) {
                        if (this.store[resourceType] > 0) {
                            if (this.transfer(container, resourceType) === OK) {
                                break;
                            }
                        }
                    }
                }
            }

            if (this.energy > 0 && this.room.links.inputs.length > 0) {
                const link = this.getFirstInRange(this.room.links.inputs, 1);
                if (link !== null) {
                    if (link.store.energy < link.store.getFreeCapacity(RESOURCE_ENERGY)) {
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
            if (this.target !== null) {
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
                    const link = this.pos.findClosestByRange(this.room.links.inputs);
                    const rangeToLink = this.pos.getRangeTo(link);
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
        if (!this.atWork) {
            // TODO: Ask squad for possible work target?

            const pos = this.moveToRoom(this.workRoom.name, false);
            return { pos: pos, isFake: true };
        }

        if (this.atWork && this.room.isMine) {
            return null;
        }

        if (this.room.towers.length > 0) {
            const tower = this.getClosestByRange(this.room.towers, (x) => x.energy > 0);
            if (tower !== null) {
                return tower;
            }
        }

        if (this.room.spawns.length > 0) {
            const spawn = this.getClosestByRange(this.room.spawns, (x) => x.energy > 0);
            if (spawn !== null) {
                return spawn;
            }
        }

        if (this.room.extensions.length > 0) {
            const extension = this.getClosestByRange(this.room.extensions, (x) => x.energy > 0);
            if (extension !== null) {
                return extension;
            }
        }

        if (this.room.storage !== null && this.room.storage.store.getUsedCapacity() > 0) {
            return this.room.storage;
        }

        if (this.room.terminal !== null && this.room.terminal.store.getUsedCapacity() > 0) {
            return this.room.terminal;
        }

        if (this.room.powerSpawn !== null && this.room.powerSpawn.energy > 0) {
            return this.room.powerSpawn;
        }

        if (this.room.labs.all.length > 0) {
            const lab = this.getClosestByRange(this.room.labs.all, (x) => x.energy > 0 || x.mineralAmount > 0);
            if (lab !== null) {
                return lab;
            }
        }

        if (this.room.links.all.length > 0) {
            const link = this.getClosestByRange(this.room.links.all, (x) => x.energy > 0);
            if (link !== null) {
                return link;
            }
        }

        return null;
    }

    selectResourceType (target) {
        if (target.store !== undefined) {
            // Containers, Storage, Terminal, etc
            for (const resourceType in target.store) {
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
