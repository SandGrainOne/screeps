'use strict';

const CreepSoldier = require('./Creep.Soldier');

/**
 * Wrapper class for creeps with logic for a room defender.
 * Primary purpose of these creeps are to defend against attacks from enemies.
 */
class CreepDefender extends CreepSoldier {
    /**
     * Perform defence related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work () {
        const hostileCreep = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (hostileCreep) {
            if (this.room.isMine && this.room.ramparts > 0) {
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

        // Attack ?
        const flagAttack = this.pos.findClosestByRange(FIND_FLAGS, { filter: (f) => f.color === COLOR_RED });

        if (flagAttack) {
            this.moveTo(flagAttack);
        }

        return true;
    }
}

module.exports = CreepDefender;
