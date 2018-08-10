'use strict';

let CreepSoldier = require('./Creep.Soldier');

/**
 * Wrapper class for creeps with logic for a healer.
 */
class CreepHealer extends CreepSoldier {
    /**
     * Perform healing related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work () {
        if (!this.atWork) {
            this.moveToRoom(this._mem.rooms.work);
            return true;
        }

        let flagAttack = this.pos.findClosestByRange(FIND_FLAGS, { filter: (f) => f.color === COLOR_RED });

        if (flagAttack) {
            this.moveTo(flagAttack);
        }

        let target = this.pos.findClosestByRange(FIND_MY_CREEPS, { filter: (c) => c.hits < c.hitsMax });
        if (target) {
            this.moveTo(target);
            if (this.pos.isNearTo(target)) {
                this._creep.heal(target);
            }
            else {
                this._creep.rangedHeal(target);
            }
        }

        if (this._creep.hits < this._creep.hitsMax) {
            this._creep.heal(this._creep);
        }

        let hostileCreep = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

        if (hostileCreep) {
            if (this.pos.getRangeTo(hostileCreep) < 3) {
                let flagRetreat = this.pos.findClosestByRange(FIND_FLAGS, { filter: (f) => f.color === COLOR_BLUE });
                this.moveTo(flagRetreat);
            }
        }

        return true;
    }
}

module.exports = CreepHealer;
