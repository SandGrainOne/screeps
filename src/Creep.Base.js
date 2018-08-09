'use strict';

let C = require('constants');

let RoomBase = require('Room.Base');

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

        this.mem.ticksToLive = this.creep.ticksToLive;
        
        if (!this.mem.rooms) {
            this.mem.rooms = {};
        }

        this.mem.rooms.current = this.creep.room.name;

        if (!this.mem.rooms.home) {
            this.mem.rooms.home = this.creep.room.name;
        }

        if (!this.mem.rooms.work) {
            this.mem.rooms.work = this.creep.room.name;
        }

        if (!this.mem.task) {
            this.mem.task = "none";
        } 
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
     * Gets the creeps job name.
     */
    get Job() {
        return this.men.job;
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
     * Gets a value indicating whether the creep is in the work room.
     */
    get AtWork() {
        return this.Room.Name === this.WorkRoom.Name;
    }

    /**
     * Gets a value indicating whether the creep is in the home room.
     */
    get AtHome() {
        return this.Room.Name === this.HomeRoom.Name;
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
        if (this.moveToRoomOld(this.HomeRoom)) {
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
        if (this.moveToRoomOld(this.WorkRoom)) {
            return true;
        }
        return false;
    }

    /**
     * The creep will move to the given room. Use this if the creep don't have a full RoomPosition.
     * 
     * @param {RoomBase} room - The room that the creep want to move to.
     * 
     * @returns {object} true if the creep is in the given room already.
     */
    moveToRoomOld(room) {
        if (room.Name !== this.Room.Name) {
            let exitDir = this.creep.room.findExitTo(room.Name);
            let exit = this.creep.pos.findClosestByRange(exitDir);
            this.moveTo(exit);
            return false;
        }
        return true;
    }

    /**
     * The creep will move to the given room. Use this if the creep don't have a full RoomPosition.
     * 
     * @param {RoomBase} room - The room that the creep want to move to.
     * 
     * @returns {object} true if the creep is in the given room already.
     */
    moveToRoom(room) {
        // Micro manage where creeps go to exit a room while looking for a specific room.
        if (C.EXIT[this.Room.Name] && C.EXIT[this.Room.Name][room.Name]) {
            let coords = C.EXIT[this.Room.Name][room.Name];
            return this.moveTo(new RoomPosition(coords.x, coords.y, this.Room.Name));
        }
        
        let exitDir = this.creep.room.findExitTo(room.Name);
        let exit = this.creep.pos.findClosestByRange(exitDir);
        return this.moveTo(exit);
    }

    /**
     * Customized movement method that wraps the default moveTo function.
     */
    moveTo(target) {
        if (this.creep.fatigue > 0) {
            return ERR_TIRED;
        }

        let pos = target.pos ? target.pos : target;
        
        let room = new RoomBase(pos.roomName);

        if (room.State !== C.ROOM_STATE_NORMAL) {
            let flag = this.creep.pos.findClosestByRange(FIND_FLAGS, { filter: (f) => f.color === COLOR_BLUE });
            if (flag) {
                let moveResult = this.creep.moveTo(flag);
                return moveResult;
            }
            return OK;
        }

        let ops = { 
            ignoreCreeps: false,
            visualizePathStyle: { fill: 'transparent', stroke: '#fff', lineStyle: 'dashed', strokeWidth: 0.1, opacity: 0.2 } 
        }

        return this.creep.moveTo(pos, ops);
    }
}

module.exports = CreepBase;
