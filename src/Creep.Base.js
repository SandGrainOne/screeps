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
        this.mem.spawnTime = this.creep.body.length * 3;

        // Ensure that there is memory space for job related information.
        if (!this.mem.job) {
            this.mem.job = {};
        }
        if (!this.mem.job.name) {
            this.mem.job.name = "unassigned";
        }
        if (!this.mem.job.task) {
            this.mem.job.task = "unassigned";
        }

        // Make sure the creep has been given rooms to work in.
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
    }

    /**
     * Gets the name of the creep.
     */
    get name() {
        return this.creep.name;
    }

    /**
     * Gets the name of the job assigned to the creep.
     */
    get job() {
        return this.mem.job.name;
    }

    /**
     * Gets the current task
     */
    get task() {
        return this.mem.job.task;
    }

    /**
     * Gets a value indicating whether the creep is retired.
     */
    get IsRetired() {
        return this.mem.ticksToLive < (this.mem.spawnTime + C.RETIREMENT);
    }

    /**
     * Gets a value indicating whether the creep is in the work room.
     */
    get AtWork() {
        return this.Room.name === this.mem.rooms.work;
    }

    /**
     * Gets a value indicating whether the creep is in the home room.
     */
    get AtHome() {
        return this.Room.name === this.mem.rooms.home;
    }

    /**
     * Gets a value indicating whether the creep is crossing room borders in line of work.
     */
    get isRemoting() {
        return this.mem.rooms.home !== this.mem.rooms.work;
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

        if (this.mustRecycle()) {
            return this._performRecycle();
        }

        if (this.mustRenew()) {
            return this._performRenew();
        }
        
        if (this.retreat()) {
            return true;
        }

        if (this.work()) {
            return true;
        }

        this.creep.say("❔");

        return false;
    }

    /**
     * Check if the creep should be recycled. This base method checks the recycle value in the creep memory.
     * 
     * @returns {Boolean} true if the creep should be recycled.
     */
    mustRecycle() {
        if (this.mem.recycle) {
            return true;
        }
        return false;
    }

    /**
     * Perform the actual recycling. This includes moving to the home room, finding a spawn and calling recycle.
     */
    _performRecycle() {
        if (!this.AtHome) {
            this.moveTo(this.moveToRoom(this.mem.rooms.home, false));
        }
        else {
            if (this.Room.Spawns.length > 0) {
                let spawns = this.creep.pos.findInRange(this.Room.Spawns, 1);
                if (spawns.length > 0) {
                    spawns[0].recycleCreep(this.creep);
                }
                else {
                    let spawn = this.creep.pos.findClosestByRange(this.Room.Spawns);
                    if (spawn) {
                        this.moveTo(spawn);
                    }
                    else {
                        this.creep.say("spawn!?");
                    }
                }
            }
        }
        return true;
    }

    /**
     * Check if the creep should be renewed. This base method always return false.
     * 
     * @returns {Boolean} true if the creep should be renewed.
     */
    mustRenew() {
        return false;
    }

    /**
     * Perform the actual renewing. This includes moving to the home room, finding a spawn and calling renew.
     */
    _performRenew() {
        if (!this.AtHome) {
            this.moveTo(this.moveToRoom(this.HomeRoom.name, false));
        }
        else {
            if (this.Room.Spawns.length > 0) {
                let spawns = this.creep.pos.findInRange(this.Room.Spawns, 1);
                if (spawns.length > 0) {
                    spawns[0].renewCreep(this.creep);
                }
                else {
                    let spawn = this.creep.pos.findClosestByRange(this.Room.Spawns);
                    if (spawn) {
                        this.moveTo(spawn);
                    }
                    else {
                        this.creep.say("spawn!?");
                    }
                }
            }
        }
        return true;
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
     * The creep will move to the given room. Use this if the creep don't have a full RoomPosition.
     * 
     * @param {string} roomName - The name of the room to move to.
     * @param {boolean} move - Set to false to have the method return a position instead of moving.
     * 
     * @returns {int} The result of the moveTo call.
     */
    moveToRoom(roomName, move = true) {
        let moveTarget = null;

        // Micro manage where creeps go to exit a room while looking for a specific room.
        if (C.EXIT[this.Room.name] && C.EXIT[this.Room.name][roomName]) {
            let coords = C.EXIT[this.Room.name][roomName];
            moveTarget = new RoomPosition(coords.x, coords.y, this.Room.name);
        }
        else {
            let exitDir = this.creep.room.findExitTo(roomName);
            moveTarget = this.creep.pos.findClosestByRange(exitDir);
        }

        if (move) {
            return this.moveTo(moveTarget);
        }
        else {
            return moveTarget;
        }
    }

    /**
     * Customized movement method that wraps the default moveTo function.
     */
    moveTo(target) {
        if (this.creep.fatigue > 0) {
            return ERR_TIRED;
        }

        let pos = target && target.pos ? target.pos : target;
        
        //let room = new RoomBase(pos.roomName);

        //if (false && room.state !== C.ROOM_STATE_NORMAL) {
        //    let flag = this.creep.pos.findClosestByRange(FIND_FLAGS, { filter: (f) => f.color === COLOR_BLUE });
        //    if (flag) {
        //        let moveResult = this.creep.moveTo(flag);
        //        return moveResult;
        //    }
        //    return OK;
        //}

        let ops = { 
            ignoreCreeps: false,
            visualizePathStyle: { fill: 'transparent', stroke: '#fff', lineStyle: 'dashed', strokeWidth: 0.1, opacity: 0.2 } 
        }

        let res = this.creep.moveTo(pos, ops);
        return res;
    }
}

module.exports = CreepBase;
