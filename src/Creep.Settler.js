'use strict';

let CreepSoldier = require('Creep.Soldier');

/**
 * Wrapper class for creeps with logic for a settler.
 * Primary purpose of these creeps are to claim or reserve a controller in other rooms.
 */
class CreepSettler extends CreepSoldier {   
    /**
     * Initializes a new instance of the CreepSettler class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep) {
        super(creep);
    }
    
    /**
     * Perform settler related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        if (this.moveOut()) {
            if (this.Name === "Charlotte") {
                if (!this.creep.pos.isNearTo(this.creep.room.controller)) {
                    this.creep.moveTo(this.creep.room.controller);
                }
                else {
                    let result = this.creep.signController(this.creep.room.controller, "Mine, pls :)");
                    console.log(result);
                }
                //this.creep.say("Claim!");
                //if (this.creep.claimController(this.creep.room.controller)) {
                //    this.creep.moveTo(this.creep.room.controller);
                //}
            }
            else {
                if (this.creep.reserveController(this.creep.room.controller)) {
                    this.creep.moveTo(this.creep.room.controller);
                }
            }
            
            this.creep.signController(this.creep.room.controller, "");
        }

        return true;
    }
}

module.exports = CreepSettler;
