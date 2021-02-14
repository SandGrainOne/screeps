'use strict';

const CreepSoldier = require('./Creep.Soldier');

/**
 * Wrapper class for creeps with logic for an attacker.
 * Primary purpose of these creeps are to perform offensive actions with the goal of damaging hostile creeps and structures.
 */
class CreepAttacker extends CreepSoldier {
    /**
     * Perform attacker related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work () {
        if (!this.atWork) {
            const flagAttack = this.findAttackFlag();
            if (flagAttack) {
                this.moveTo(flagAttack);
            }
            else {
                this.moveToRoom(this._mem.rooms.work);
            }
            return true;
        }

        const hostileCreep = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (hostileCreep) {
            if (this.room.isMine && this.room.ramparts > 0) {
                this.moveTo(hostileCreep);
                const ramps = hostileCreep.pos.findInRange(FIND_MY_STRUCTURES, 1, { filter: (s) => s.structureType === STRUCTURE_RAMPART });
                if (ramps.length > 0) {
                    if (!this.pos.isEqualTo(ramps[0])) {
                        this.moveTo(ramps[0]);
                    }
                }
                this.attack(hostileCreep);
            }
            else {
                this.attack(hostileCreep);
                this.moveTo(hostileCreep);
            }
            return true;
        }

        const enemyStructure = this.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
            filter: (it) => it.structureType !== STRUCTURE_CONTROLLER && it.structureType !== STRUCTURE_POWER_BANK
        });
        if (enemyStructure !== null) {
            if (this.attack(enemyStructure) === ERR_NOT_IN_RANGE) {
                this.moveTo(enemyStructure);
            }
            return true;
        }

        const flagAttack = this.findAttackFlag();
        if (flagAttack && !this.pos.isNearTo(flagAttack)) {
            this.moveTo(flagAttack);
        }

        return true;
    }

    findAttackFlag () {
        const room = this.atWork ? this.room : this.workRoom;
        if (!room.isVisible) {
            return null;
        }

        const redFlags = room.flags[COLOR_RED];
        if (Array.isArray(redFlags) && redFlags.length > 0) {
            return redFlags[0];
        }
        return null;
    }
}

module.exports = CreepAttacker;
