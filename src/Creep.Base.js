'use strict';

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
        this.activity = "idling";
    }

    /**
     * Retrieve the creeps current task
     */
    get Task() {
        return this.getMem("task") !== null ? this.getMem("task") : "none";
    }

    /**
     * Give the creep a task
     */
    set Task(task) {
        this.setMem("task", task);
    }
    
    /**
     * Run all creep logic.
     * 
     * @returns {Boolean} true if the action was successful
     */
    act() {
        if (this.creep.spawning) {
            return true;
        }
        
        if (this.renew()) {
            this.sayRandom("renewing");
            return true;
        }

        if (this.retire()) {
            this.sayRandom("retiring");
            return true;
        }
        
        if (this.retreat()) {
            this.sayRandom("retreating");
            return true;
        }

        if (this.work()) {
            this.sayRandom(this.activity);
            return true;
        }
        
        this.sayRandom("waiting");      
        return false;
    }
    
    /**
     * Perform the required checks to see if the creep should be renewed and if so, then
     * steer the creep to a place where a renew can occur.
     * 
     * @returns {Boolean} true if the creep is being renewed
     */
    renew() {
        return false;
    }
    
    /**
     * Perform a retirement if it's needed. This means it will move to the graveyard.
     * 
     * @returns {Boolean} true if the creep is getting old and is retiring
     */
    retire() {
        if (this.creep.ticksToLive > 40) {
            return false;
        }
        
        let spawn = this.creep.pos.findClosestByPath(FIND_MY_SPAWNS);
            
        if (spawn !== null) {
            if (!(this.creep.pos.x === spawn.pos.x && this.creep.pos.y === spawn.pos.y)) {
                this.creep.moveTo(spawn.pos.x + 1, spawn.pos.y + 1);
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
    
    getRoom() {
        return new RoomBase(this.creep.room);
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
    
    /**
     * Make the creep say a message. This will only succeed every 10 ticks to reduce the spam.
     * 
     * @param {string} message - The message to be said
     */
    sayRandom(message) {
        if ((Math.floor((Math.random() * 10) + 1)) % 10 === 0) {
            this.creep.say(message);
        }
    }
}

module.exports = CreepBase;
