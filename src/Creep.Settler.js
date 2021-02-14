'use strict';

const CreepWorker = require('./Creep.Worker');

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
                if (this.room.controller.sign) {
                    this._creep.signController(this.room.controller, '');
                }

                if (this.room.name === 'E73N84') {
                    this._creep.claimController(this.room.controller);
                }
                else {
                    this._creep.reserveController(this.room.controller);
                }
            }
        }

        if (!this.atWork) {
            const room = this.atWork ? this.room : this.workRoom;

            if (room.isVisible && room.controller) {
                this.moveTo(room.controller);
            }
            else {
                this.moveToRoom(this._mem.rooms.work);
            }
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
