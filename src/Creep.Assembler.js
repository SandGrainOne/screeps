'use strict';

const CreepWorker = require('./Creep.Worker');

/**
 * Wrapper class for creeps with logic for an assembler.
 * Primary purpose of these creeps are to maintain a factory.
 */
class CreepAssember extends CreepWorker {
    /**
     * Perform assembler related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work () {
        if (!this.atWork) {
            this.moveToRoom(this._mem.rooms.work);
            return true;
        }

        if (this.room.factory === null) {
            return false;
        }
    }
}

module.exports = CreepAssember;
