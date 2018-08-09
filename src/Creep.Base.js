'use strict';

let C = require('constants');

let RoomBaseV2 = require('Room.BaseV2');
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
        this.baseInit();
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
        //return false;
        if (this.Room.State !== C.ROOM_STATE_NORMAL) {
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
        
        let room = new RoomFake(pos.roomName);
        //console.log(room.Name);
        //console.log(room.State);

        if (room.State !== C.ROOM_STATE_NORMAL) {
            //console.log(this.Name);
            let flag = this.creep.pos.findClosestByRange(FIND_FLAGS, { filter: (f) => f.color === COLOR_BLUE });
            //console.log(flag)
            if (flag) {
                let moveResult = this.creep.moveTo(flag);
                //console.log(moveResult);
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

    /**
     * Prepare the creep short and long term memory.
     */
    baseInit() {
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

        this.mem.rooms = {};
        this.mem.rooms.current = this.creep.room.name;
        this.mem.rooms.home = this.mem.homeroom;
        this.mem.rooms.work = this.mem.workroom;
    }
}

module.exports = CreepBase;
