'use strict';

let CreepSoldier = require('Creep.Soldier');

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
        if (!this.atWork) {
            this.moveTo(this.moveToRoom(this.WorkRoom.name, false));
            return true;
        }

        let hostile = this.creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

        if (hostile) {
            if (this.creep.pos.getRangeTo(hostile) > 3) {
                this.creep.moveTo(hostile);
            }
            else {
                this.creep.rangedAttack(hostile);
                if (this.creep.pos.getRangeTo(hostile) < 3) {
                    let retreatPosition = this.creep.pos.findClosestByRange(FIND_FLAGS, { filter: (f) => f.color === COLOR_BLUE });
                    if (retreatPosition) {
                        this.moveTo(retreatPosition);
                    }
                }
            }
        }
        else {
            if (this.Room.keeperLairs.length > 0) {
                // The keeper lairs are already sorted by the ticksToSpawn value
                if (this.creep.pos.getRangeTo(this.Room.keeperLairs[0]) > 3) {
                    this.creep.moveTo(this.Room.keeperLairs[0]);
                }
            }
        }

        if (this.creep.hits < this.creep.hitsMax) {
            this.creep.heal(this.creep);
            let health = this.creep.hits / this.creep.hitsMax
            if (health < 0.4) {
                let retreatPosition = this.creep.pos.findClosestByRange(FIND_FLAGS, { filter: (f) => f.color === COLOR_BLUE });
                if (retreatPosition) {
                    this.moveTo(retreatPosition);
                }
            }
        }

        return true;
    }
}

module.exports = CreepPatroler;
