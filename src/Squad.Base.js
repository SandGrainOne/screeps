'use strict';

/**
 * The SquadBase class is the base class for all type of squads. 
 */
class SquadBase {
    /**
     * Initializes a new instance of the SquadBase class with the specified name.
     * 
     * @param {string} name - The name of the squad
     */
    constructor (name) {
        this._name = name;

        if (!_.isUndefined(Memory.squads[this._name])) {
            Memory.squads[this._name] = {};
        }
        this._mem = Memory.squads[this._name];

        if (_.isUndefined(this._mem.isRetired)) {
            this._mem.isRetired = false;
        }

        if (_.isUndefined(this._mem.isWaiting)) {
            this._mem.isWaiting = true;
        }

        if (_.isUndefined(this._mem.isActive)) {
            this._mem.isActive = false;
        }

        this._cache = {};
        this._cache.creeps = {};
    }

    /**
     * Gets a value indicating whether the Squad still have work to do
     */
    get isRetired () {
        return this._mem.isRetired;
    }

    /**
     * Sets a value indicating whether the Squad still have work to do
     */
    set isRetired (value) {
        this._mem.isRetired = value;
    }

    /**
     * Gets a value indicating whether the Squad is waiting for its squad members
     */
    get isWaiting () {
        return this._mem.isWaiting;
    }

    /**
     * Sets a value indicating whether the Squad is waiting for its squad members
     */
    set isWaiting (value) {
        this._mem.isWaiting = value;
    }

    /**
     * Gets a value indicating whether the Squad is actively performing its work
     */
    get isActive () {
        return this._mem.isActive;
    }

    /**
     * Sets a value indicating whether the Squad is actively performing its work
     */
    set isActive (value) {
        this._mem.isActive = value;
    }

    /**
     * Add a creep to the squad. Mostly used during tick preparation.
     * 
     * @param {string} creepJob - The type of job performed by the creep
     * @param {string} creepName - The name of the Creep being added
     */
    addCreep (creepJob, creepName) {
        if (!_.isArray(this._cache.creeps[creepJob])) {
            this._cache.creeps[creepJob] = [];
        }
        this._cache.creeps[creepJob].push(creepName);
    }

    run () {
        this.isRetired = true;
    }
}

module.exports = SquadBase;
