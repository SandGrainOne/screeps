'use strict';

let C = require('constants')
let RoomBase = require('Room.Base');

/**
 * Wrapper class with basic logic for creeps.
 */
class CreepBase {
    /**
     * Initializes a new instance of the CreepBase class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped.
     */
    constructor(creep) {
        this.creep = creep;
    }

    /**
     * Gets the name of the creep.
     */
    get Name() {
        return this.creep.name;
    }

    /**
     * Gets the stored number of remaining ticks to live.
     */
    get TicksToLive() {
        return this.getMem("ticksToLive");
    }

    /**
     * Gets or sets the current task.
     */
    get Task() {
        return this.getMem("task") !== null ? this.getMem("task") : "none";
    }
    set Task(value) {
        this.setMem("task", value);
    }

    /**
     * Gets the home room of the creep.
     */
    get HomeRoom() {
        if (!this.getMem("homeroom")) {
            this.setMem("homeroom", this.Room.Name);
        }
        return this.getMem("homeroom");
    }

    /**
     * Gets the remote work room of the creep.
     */
    get RemoteRoom() {
        if (!this.getMem("remoteroom")) {
            this.setMem("remoteroom", this.Room.Name);
        }
        return this.getMem("remoteroom");
    }

    /**
     * Gets the current room object.
     */
    get Room() {
        return new RoomBase(this.creep.room);
    }

    /**
     * Run all creep logic. If this function returns true, the creep should not be asked
     * to perform additional actions this tick.
     * 
     * @returns {Boolean} true if the creep successfully has performed an action.
     */
    act() {
        this.save();

        if (this.creep.spawning) {
            return true;
        }

        if (this.renew()) {
            return true;
        }
        
        if (this.retreat()) {
            return true;
        }

        if (this.work()) {
            return true;
        }

        return false;
    }
    
    /**
     * Perform the required checks to see if the creep should be renewed and if so, then
     * stear the creep to a place where a renew can occur.
     * 
     * @returns {Boolean} true if the creep is being renewed
     */
    renew() {
        return false;
    }

    /**
     * Perform a retreat if there is an enemy creep or tower attacking the creep.
     * 
     * @returns {Boolean} true if the retreat was required and the creep is on the move
     */
    retreat() {
        return false;
    }

    /**
     * Perform job related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        return false;
    }

    /**
     * The creep will move to its remote room.
     * 
     * @param {boolean} sneak - Don't move into the room, but stay on the exit.
     * 
     * @returns {object} true if the creep is in the remote room already.
     */
    moveOut(sneak) {
        if (this.moveToRoom(this.RemoteRoom)) {
            if (!sneak) {
                this.moveIn();
            }
            return true;
        }
        return false;
    }

    /**
     * The creep will move to its home room.
     * 
     * @returns {object} true if the creep is in the home room already.
     */
    moveHome(){
        if (this.moveToRoom(this.HomeRoom)) {
            this.moveIn();
            return true;
        }
        return false;
    }

    /**
     * The creep will move to the given room.
     * 
     * @returns {object} true if the creep is in the given room already.
     */
    moveToRoom(roomName) {
        if (this.Room.Name !== roomName) {
            let exitDir = this.creep.room.findExitTo(roomName);

            let roomExits = C.EXIT[this.Room.Name];
            if (roomExits && roomExits[exitDir]) {
                this.creep.moveTo(roomExits[exitDir].x, roomExits[exitDir].y);
            }
            else {
                let exit = this.creep.pos.findClosestByRange(exitDir);
                this.creep.moveTo(exit);
            }
            return false;
        }
        return true;
    }

    /**
     * Make the creep move off the exit zone and into the room. This will normally
     * be overruled by any other movement action performed by work logic.
     */
    moveIn() {
        if (this.creep.pos.x === 0) {
            this.creep.moveTo(this.creep.pos.x + 1, this.creep.pos.y);
        }
        if (this.creep.pos.x === 49) {
            this.creep.moveTo(this.creep.pos.x - 1, this.creep.pos.y);
        }
        if (this.creep.pos.y === 0) {
            this.creep.moveTo(this.creep.pos.x, this.creep.pos.y + 1);
        }
        if (this.creep.pos.y === 49) {
            this.creep.moveTo(this.creep.pos.x, this.creep.pos.y - 1);
        }
    }

    save() {
        // Make sure it is possible to find time of death from memory.
        this.setMem("ticksToLive", this.creep.ticksToLive);
    }

    /**
     * Get something from the creep memory. 
     * 
     * @returns {object} The value stored under the given key. null if not found.
     */
    getMem(key) {
        if (typeof this.creep.memory[key] != 'undefined') {
            return this.creep.memory[key];
        }
        
        return null;
    }

    /**
     * Store a value to the creep memory under the given key.
     * 
     * @param {string} key - The key assigned to the storage.
     * @param {value} value - The value to be stored under the key.
     */
    setMem(key, value) {
        if (this.creep.memory[key] !== value) {
            this.creep.memory[key] = value;
        }
    }
}

module.exports = CreepBase;
