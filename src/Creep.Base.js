'use strict';

let C = require('./constants');

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
        return Empire.squads.get(this._mem.squad);
    }

    /**
     * Gets the room where there creep currently reside.
     */
    get room () {
        return Empire.rooms.get(this._creep.room.name);
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
        return _.isUndefined(this._mem.work) ? null : this._mem.work.task;
    }

    /**
     * Sets the current task
     */
    set task (value) {
        if (_.isUndefined(this._mem.work)) {
            this._mem.work = {};
        }
        this._mem.work.task = value;
    }

    /**
     * Gets a value indicating whether the creep is retired.
     */
    get isRetired () {
        return this._creep.ticksToLive < (this._mem.spawnTime + C.RETIREMENT);
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
     * Gets the designated work room.
     */
    get workRoom () {
        return Empire.getRoom(this._mem.rooms.work);
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
        let task = this.getTask();

        if (!_.isNull(task)) {
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
                let spawn = this.getFirstInRange(this.room.spawns, 1);
                if (spawn) {
                    spawn.recycleCreep(this._creep);
                }
                else {
                    let spawn = this.pos.findClosestByRange(this.room.spawns);
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
            let coords = C.EXIT[this.room.name][roomName];
            moveTarget = new RoomPosition(coords.x, coords.y, this.room.name);
        }
        else {
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
        _.defaults(options, {
            ignoreCreeps: true,
            reusePath: 60,
            range: 1,
            visualizePathStyle: { fill: 'transparent', stroke: '#fff', lineStyle: 'dashed', strokeWidth: 0.1, opacity: 0.2 }
        });

        // If the target is an exit tile. The creep must move on it.
        if (this.isExit(target)) {
            options.range = 0;
        }

        if (this.pos.getRangeTo(target) <= options.range) {
            return OK;
        }

        let previousPos = this._mem.previousPos || [0, 0];

        if (this.pos.x === previousPos[0] && this.pos.y === previousPos[1]) {
            this._mem.stuckCounter = (this._mem.stuckCounter || 0) + 1;
            if (this._mem.stuckCounter > 3) {
                // The thing blocking the path is probably a creep.
                options.ignoreCreeps = false;
                // Forget current path.
                options.reusePath = 1;
            }
            else if (this._mem.stuckCounter > 1) {
                if (this._mem._move && this._mem._move.path) {
                    let path = Room.deserializePath(this._mem._move.path);
                    let creeps = this._creep.room.lookForAt(LOOK_CREEPS, path[0].x, path[0].y);
                    if (creeps.length > 0 && Game.creeps[creeps[0].name]) {
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
     * Get the first room object in the array of objects that is within the given range.
     * 
     * @param {RoomObject[]} roomObjects - The array of room objects to seach through.
     * @param {int} range - The maximum range between creep and room object.
     * 
     * @returns {RoomObject} - The first room object without the given range if found. Otherwise null.
     */
    getFirstInRange (roomObjects, range) {
        if (!Array.isArray(roomObjects)) {
            return null;
        }

        if (roomObjects.length === 1) {
            if (this.pos.getRangeTo(roomObjects[0]) <= range) {
                return roomObjects[0];
            }
            return null;
        }

        for (let obj of roomObjects) {
            if (this.pos.getRangeTo(obj) <= range) {
                return obj;
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
