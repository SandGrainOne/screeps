'use strict';

let CreepSoldier = require('./Creep.Soldier');

/**
 * Wrapper class for creeps with logic for a room patroler.
 * Primary purpose of these creeps are to patrol a keeper room and to kill the keepers.
 */
class CreepPatroler extends CreepSoldier {
    /**
     * Initializes a new instance of the CreepPatroler class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep) {
        super(creep);
    }
    
    /**
     * Perform patroler related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        if (this._creep.hits < this._creep.hitsMax) {
            this._creep.heal(this._creep);
        }

        if (!this.atWork) {
            this.moveTo(this.moveToRoom(this.WorkRoom.name, false));
            return true;
        }

        let hostile = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

        if (hostile) {
            if (this.pos.getRangeTo(hostile) > 3) {
                this.moveTo(hostile);
            }
            else {
                this.rangedAttack(hostile);
                if (this.pos.getRangeTo(hostile) < 3) {
                    let retreatPosition = this.pos.findClosestByRange(FIND_FLAGS, { filter: (f) => f.color === COLOR_BLUE });
                    if (retreatPosition) {
                        this.moveTo(retreatPosition);
                    }
                }
            }
        }
        else {
            if (this.room.keeperLairs.length > 0) {
                // The keeper lairs are already sorted by the ticksToSpawn value
                if (this.pos.getRangeTo(this.room.keeperLairs[0]) > 3) {
                    this.moveTo(this.room.keeperLairs[0]);
                }
            }
        }

        if (this._creep.hits < this._creep.hitsMax) {
            let health = this._creep.hits / this._creep.hitsMax
            if (health < 0.4) {
                let retreatPosition = this.pos.findClosestByRange(FIND_FLAGS, { filter: (f) => f.color === COLOR_BLUE });
                if (retreatPosition) {
                    this.moveTo(retreatPosition);
                }
            }
        }

        return true;
    }
}

module.exports = CreepPatroler;
