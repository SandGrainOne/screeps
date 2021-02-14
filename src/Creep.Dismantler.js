'use strict';

const C = require('./constants');

const CreepWorker = require('./Creep.Worker');

/**
 * Wrapper class for creeps with logic for a dismantler.
 * Primary purpose of these creeps are to break down both friendly and hostile structures.
 */
class CreepDismantler extends CreepWorker {
    /**
     * Perform dismantler related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work () {
        if (this.target === null) {
            this.target = this.findWorkTarget();
        }

        if (this.target !== null && this.target.isFake && this.atWork) {
            // A fake target in a visible room. Find another target.
            this.target = null;
        }

        if (this.target !== null && this.atWork) {
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

            return true;
        }

        return false;
    }

    findWorkTarget () {
        if (!this.atWork) {
            // TODO: Ask squad for possible work target?

            const pos = this.moveToRoom(this.workRoom.name, false);
            return { pos: pos, isFake: true };
        }

        if (this.room.flags[COLOR_GREY] !== undefined) {
            for (const flag of this.room.flags[COLOR_GREY]) {
                const structures = flag.pos.lookFor(LOOK_STRUCTURES);
                if (structures.length > 0) {
                    if (this.room.isMine || structures[0].my) {
                        structures[0].notifyWhenAttacked(false);
                    }
                    return structures[0];
                }
            }
        }

        if (this.room.isMine) {
            // Do not dismantle random structures in owned rooms.
            return null;
        }

        if (this.room.ramparts.length > 0) {
            const rampart = this.getClosestByRange(this.room.ramparts);
            if (rampart !== null) {
                return rampart;
            }
        }

        if (this.room.towers.length > 0) {
            const tower = this.getClosestByRange(this.room.towers, (x) => x.energy === 0);
            if (tower !== null) {
                return tower;
            }
        }

        if (this.room.spawns.length > 0) {
            const spawn = this.getClosestByRange(this.room.spawns, (x) => x.energy === 0);
            if (spawn !== null) {
                return spawn;
            }
        }

        if (this.room.extensions.length > 0) {
            const extension = this.getClosestByRange(this.room.extensions, (x) => x.energy === 0);
            if (extension !== null) {
                return extension;
            }
        }

        if (this.room.links.all.length > 0) {
            const link = this.getClosestByRange(this.room.links.all, (x) => x.energy === 0);
            if (link !== null) {
                return link;
            }
        }

        if (this.room.labs.all.length > 0) {
            const lab = this.getClosestByRange(this.room.labs.all, (x) => x.energy === 0 && x.mineralAmount === 0);
            if (lab !== null) {
                return lab;
            }
        }

        if (this.room.storage !== null && this.room.storage.store.getUsedCapacity() === 0) {
            return this.room.storage;
        }

        if (this.room.terminal !== null && this.room.terminal.store.getUsedCapacity() === 0) {
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

        if (this.room.nuker !== null) {
            // A nuker cannot be emptied.
            return this.room.nuker;
        }

        if (this.room.walls.length > 0) {
            const wall = this.getClosestByRange(this.room.walls);
            if (wall !== null) {
                return wall;
            }
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

        const res = this._creep.dismantle(target);
        if (res === OK) {
            this._energy = Math.min(this._capacity, this._energy + Math.floor(this._baseStrength * C.DISMANTLE_ENERGY_GAIN));
            this._performedWork.dismantle = true;
        }
        return res;
    }
}

module.exports = CreepDismantler;
