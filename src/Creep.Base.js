'use strict';

const C = require('./constants');

/**
 * The CreepBase class is the base class for all creep wrappers. 
 */
class CreepBase {
    /**
     * Initializes a new instance of the CreepBase class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped.
     */
    constructor (creep) {
        this._creep = creep;
        this._mem = creep.memory;

        // Tick cache
        this._cache = {};
    }

    /**
     * Gets the name of the creep.
     */
    get name () {
        return this._creep.name;
    }

    /**
     * Gets the name of the job assigned to the creep.
     */
    get job () {
        return this._mem.job;
    }

    /**
     * Gets the the squad the creep is a part of
     * 
     * @returns {string} - Name of squad
     */
    get squad () {
        if (this._cache.squad !== undefined) {
            return this._cache.squad;
        }
        this._cache.squad = Empire.squads.get(this._mem.squad);
        return this._cache.squad;
    }

    /**
     * Gets the room where there creep currently reside.
     */
    get room () {
        if (this._cache.room !== undefined) {
            return this._cache.room;
        }
        this._cache.room = Empire.rooms.get(this._creep.room.name);
        return this._cache.room;
    }

    /**
     * Gets the current position of the creep.
     */
    get pos () {
        return this._creep.pos;
    }

    /**
     * Gets the current task
     */
    get task () {
        return this._mem.work === undefined ? null : this._mem.work.task;
    }

    /**
     * Sets the current task
     */
    set task (value) {
        if (this._mem.work === undefined) {
            this._mem.work = {};
        }
        this._mem.work.task = value;
    }

    /**
     * Gets a value indicating whether the creep is retired.
     */
    get isRetired () {
        return this._creep.ticksToLive < (this._creep.body.length * CREEP_SPAWN_TIME + C.RETIREMENT);
    }

    /**
     * Gets a value indicating whether the creep is in the work room.
     */
    get atWork () {
        return this.room.name === this._mem.rooms.work;
    }

    /**
     * Gets a value indicating whether the creep is in the home room.
     */
    get isHome () {
        return this.room.name === this._mem.rooms.home;
    }

    /**
     * Gets a value indicating whether the creep is crossing room borders in line of work.
     */
    get isRemoting () {
        return this._mem.rooms.home !== this._mem.rooms.work;
    }

    /**
     * Gets the designated home room.
     */
    get homeRoom () {
        if (this._cache.homeRoom !== undefined) {
            return this._cache.homeRoom;
        }
        this._cache.homeRoom = Empire.getRoom(this._mem.rooms.home);
        return this._cache.homeRoom;
    }

    /**
     * Gets the designated work room.
     */
    get workRoom () {
        if (this._cache.workRoom !== undefined) {
            return this._cache.workRoom;
        }
        this._cache.workRoom = Empire.getRoom(this._mem.rooms.work);
        return this._cache.workRoom;
    }

    /**
     * This function is a wrapper for creep.say().
     * Currently has no logic of its own.
     * 
     * @param {string} message - The message to be displayed.
     */
    say (message) {
        this._creep.say(message);
    }

    /**
     * Run all creep logic. If this function returns true, the creep should not be asked
     * to perform additional actions this tick.
     * 
     * @returns {Boolean} true if the creep successfully has performed an action.
     */
    act () {
        // Temporary solution for spawning help for rooms of lower RCL.
        if (this.isRemoting && this.atWork && this.workRoom.isMine) {
            this._mem.rooms.home = this._mem.rooms.work;
        }

        const task = this.getTask();

        if (task !== null) {
            if (typeof this[task] !== 'function') {
                throw new Error('This creep wrapper does not have any task with the name ' + task);
            }

            this[task]();
            return;
        }

        if (this.work()) {
            return true;
        }

        this.say('❔');

        return false;
    }

    /**
     * Determine what task the creep should undertake this tick.
     */
    getTask () {
        if (this._creep.spawning) {
            return 'spawning';
        }

        if (this._mem.recycle) {
            return 'recycling';
        }

        return null;
    }

    /**
     * Perform any task logic related to spawning.
     */
    spawning () {
    }

    /**
     * Perform any task logic related to recycling.
     */
    recycling () {
        if (!this.isHome) {
            this.moveTo(this.moveToRoom(this._mem.rooms.home, false));
        }
        else {
            if (this.room.spawns.length > 0) {
                const spawn = this.getFirstInRange(this.room.spawns, 1);
                if (spawn) {
                    spawn.recycleCreep(this._creep);
                }
                else {
                    const spawn = this.pos.findClosestByRange(this.room.spawns);
                    if (spawn) {
                        this.moveTo(spawn);
                    }
                    else {
                        this.say('spawn!?');
                    }
                }
            }
        }
        return true;
    }

    /**
     * Perform job related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work () {
        return false;
    }

    /**
     * Gets the the target RoomObject or its position if not visible.
     */
    get target () {
        if (this._cache.target === undefined) {
            if (this._mem.target !== undefined) {
                this._cache.target = Game.getObjectById(this._mem.target.id);

                if (this._cache.target === null && this._mem.target.pos !== undefined && !this.room.isVisible) {
                    const posComponents = this._mem.target.pos.split(',');
                    const pos = new RoomPosition(posComponents[0], posComponents[1], posComponents[2]);
                    this._cache.target = { pos: pos, isFake: true };
                }
            }
            else {
                this._cache.target = null;
            }
        }
        return this._cache.target;
    }

    /**
     * Sets the creep job target.
     */
    set target (obj) {
        if (obj !== null) {
            this._cache.target = obj;
            this._mem.target = {};
            this._mem.target.id = obj.id;
            this._mem.target.pos = `${obj.pos.x},${obj.pos.y},${obj.pos.roomName}`;
        }
        else {
            this._cache.target = null;
            delete this._mem.target;
        }
    }

    /**
     * The creep will move to the given room. Use this if the creep don't have a full RoomPosition.
     * 
     * @param {string} roomName - The name of the room to move to.
     * @param {boolean} move - Set to false to have the method return a position instead of moving.
     * 
     * @returns {int} The result of the moveTo call.
     */
    moveToRoom (roomName, move = true) {
        let moveTarget = null;

        // Micro manage where creeps go to exit a room while looking for a specific room.
        if (C.EXIT[this.room.name] && C.EXIT[this.room.name][roomName]) {
            const coords = C.EXIT[this.room.name][roomName];
            moveTarget = new RoomPosition(coords.x, coords.y, this.room.name);
        }

        if (moveTarget === null) {
            moveTarget = new RoomPosition(24, 24, roomName);
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
     * 
     * @param {RoomObject|RoomPosition} target - The location the creep should move to.
     * @param {object} options - An object containing additional options.
     */
    moveTo (target, options) {
        if (this._creep.fatigue > 0) {
            return ERR_TIRED;
        }

        // Normalize the input.
        if (!(target instanceof RoomPosition)) {
            target = target.pos;
        }

        // Create and set some default move options.
        options = options || {};
        options.ignoreCreeps = options.ignoreCreeps !== undefined ? options.ignoreCreeps : true;
        options.reusePath = options.reusePath !== undefined ? options.reusePath : 60;
        options.range = options.range !== undefined ? options.range : 1;
        options.visualizePathStyle = options.visualizePathStyle !== undefined ? options.visualizePathStyle : { fill: 'transparent', stroke: '#fff', lineStyle: 'dashed', strokeWidth: 0.1, opacity: 0.2 };

        // If the target is an exit tile. The creep must move on it.
        if (this.isExit(target)) {
            options.range = 0;
        }

        if (this.pos.getRangeTo(target) <= options.range) {
            return OK;
        }

        const previousPos = this._mem.previousPos || [0, 0];

        if (this.pos.x === previousPos[0] && this.pos.y === previousPos[1]) {
            this._mem.stuckCounter = (this._mem.stuckCounter || 0) + 1;
            if (this._mem.stuckCounter > 3) {
                options.ignoreCreeps = false;
                options.reusePath = 0;
            }
            else if (this._mem.stuckCounter > 1) {
                if (this._mem._move && this._mem._move.path) {
                    const path = Room.deserializePath(this._mem._move.path);
                    const creeps = this._creep.room.lookForAt(LOOK_CREEPS, path[0].x, path[0].y);
                    if (creeps.length > 0 && Game.creeps[creeps[0].name] && creeps[0].memory.job !== 'miner' && creeps[0].memory.job !== 'linker') {
                        creeps[0].move(creeps[0].pos.getDirectionTo(this.pos));
                    }
                }
            }
        }
        else {
            delete this._mem.stuckCounter;
        }

        this._mem.previousPos = [this.pos.x, this.pos.y];

        return this._creep.moveTo(target, options);
    }

    /**
     * Get the closest room object in the array of objects.
     * 
     * @param {RoomObject[]} roomObjects - The array of room objects to search through.
     * @param {any} filter - (optional) A function that the object must match.
     * 
     * @returns {RoomObject} - The closest room object in the array. 
     */
    getClosestByRange (roomObjects, filter) {
        if (!Array.isArray(roomObjects) || roomObjects.length === 0) {
            return null;
        }

        if (roomObjects.length === 1) {
            if (this.pos.roomName === roomObjects[0].pos.roomName) {
                if (filter === undefined || filter(roomObjects[0])) {
                    return roomObjects[0];
                }
            }
            return null;
        }

        let currentRange = Infinity;
        let closest = null;
        for (let i = 0; i < roomObjects.length; i++) {
            const range = this.pos.getRangeTo(roomObjects[i]);
            if (currentRange > range) {
                if (filter === undefined || filter(roomObjects[i])) {
                    currentRange = range;
                    closest = roomObjects[i];
                }
            }
        }
        return closest;
    }

    /**
     * Get the first room object in the array of objects that is within the given range.
     * 
     * @param {RoomObject[]} roomObjects - The array of room objects to search through.
     * @param {number} range - The maximum range between creep and room object.
     * @param {any} filter - (optional) A function that the object must match.
     * 
     * @returns {RoomObject} - The first room object without the given range if found. Otherwise null.
     */
    getFirstInRange (roomObjects, range, filter) {
        if (!Array.isArray(roomObjects) || roomObjects.length === 0) {
            return null;
        }

        if (roomObjects.length === 1) {
            if (this.pos.getRangeTo(roomObjects[0]) <= range) {
                if (filter === undefined || filter(roomObjects[0])) {
                    return roomObjects[0];
                }
            }
            return null;
        }

        for (let i = 0; i < roomObjects.length; i++) {
            if (this.pos.getRangeTo(roomObjects[i]) <= range) {
                if (filter === undefined || filter(roomObjects[i])) {
                    return roomObjects[i];
                }
            }
        }
        return null;
    }

    /**
     * Analyze the given room and identify the appropriate number of miners as well as their body.
     * This base function is empty. Overload in child classes.
     * 
     * @param room - An instance of a visible smart room.
     */
    static defineJob (room) {
    }

    isExit (target) {
        return target.x === 0 || target.y === 0 || target.x === 49 || target.y === 49;
    }
}

module.exports = CreepBase;
