'use strict';

let C = require('./constants');

let CreepWorker = require('./Creep.Worker');

/**
 * Wrapper class for creeps with logic for a settler.
 * Primary purpose of these creeps are to claim or reserve a controller in other rooms.
 */
class CreepSettler extends CreepWorker {
    /**
     * Perform settler related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work () {
        if (this.atWork) {
            if (this.room.controller && this.pos.isNearTo(this.room.controller)) {
                if (!this.room.controller.sign || this.room.controller.sign.username !== C.USERNAME) {
                    this._creep.signController(this.room.controller, 'For the Sand empire!');
                }
                if (this.room.name === 'E71N87') {
                    this._creep.claimController(this.room.controller);
                }
                else {
                    this._creep.reserveController(this.room.controller);
                }
            }
        }

        if (!this.atWork) {
            this.moveToRoom(this._mem.rooms.work);
        }
        else {
            if (this.room.controller && !this.pos.isNearTo(this.room.controller)) {
                this.moveTo(this.room.controller);
            }
        }

        return true;
    }
}

module.exports = CreepSettler;
