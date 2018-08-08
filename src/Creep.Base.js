'use strict';

let C = require('constants');

let RoomBase = require('Room.Base');
let RoomFake = require('Room.Fake');

/**
 * The CreepBase class is the base class for all creep wrappers. 
 */
class CreepBase {
    /**
     * Initializes a new instance of the CreepBase class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped.
     */
    constructor(creep) {
        this.creep = creep;
        this.mem = creep.memory;
        this.init();
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
        return this.creep.ticksToLive;
    }

    /**
     * Gets the current task.
     */
    get Task() {
        return this.mem.task;
    }

    /**
     * Sets the current task.
     */
    set Task(value) {
        this.mem.task = value;
    }

    /**
     * Run all creep logic. If this function returns true, the creep should not be asked
     * to perform additional actions this tick.
     * 
     * @returns {Boolean} true if the creep successfully has performed an action.
     */
    act() {
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
        if (this.Room.State !== "normal") {
            this.creep.say("help");
            this.moveHome();
            return true;
        }
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
     * The creep will move to its work room.
     * 
     * @param {boolean} sneak - Don't move into the room, but stay on the exit.
     * 
     * @returns {object} true if the creep is in the work room already.
     */
    moveOut(sneak) {
        if (this.moveToRoom(this.WorkRoom)) {
            if (!sneak) {
                this.moveIn();
            }
            return true;
        }
        return false;
    }

    /**
     * The creep will move to the given room.
     * 
     * @returns {object} true if the creep is in the given room already.
     */
    moveToRoom(room) {
        // Don't move into a room under siege.
        if (room.State !== "normal") {
            let flag = this.creep.pos.findClosestByRange(FIND_FLAGS, { filter: (f) => f.color === COLOR_BLUE });
            if (flag) {
                this.creep.moveTo(flag);
            }
            return false;
        }

        if (this.Room.Name !== room.Name) {
            let exitDir = this.creep.room.findExitTo(room.Name);

            let roomExits = C.EXIT[this.Room.Name];
            if (roomExits && roomExits[exitDir]) {
                this.creep.moveTo(roomExits[exitDir].x, roomExits[exitDir].y, { maxRooms: 1 });
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
     * Make the creep move off the exit zone and into the room. This move will normally
     * be replaced by any other movement action performed by work logic.
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

    /**
     * Prepare the creep short and long term memory.
     */
    init() {
        if (!this.mem.homeroom) {
            this.mem.homeroom = this.creep.room.name;
        }
        if (!this.mem.workroom) {
            this.mem.workroom = this.mem.homeroom;
        }
        if (!this.mem.task) {
            this.mem.task = "none";
        } 

        this.mem.ticksToLive = this.creep.ticksToLive;

        this.Room = this.getRoom(this.creep.room.name);
        this.HomeRoom = this.getRoom(this.mem.homeroom);
        this.WorkRoom = this.getRoom(this.mem.workroom);
    }

    /**
     * Attempt to get the room from the list of visible rooms and wrap it in room type specific logic.
     */
    getRoom(name) {
        let room = Game.rooms[name];
        if (room) {
            return new RoomBase(room);
        }
        return new RoomFake(name);
    }
}

module.exports = CreepBase;
