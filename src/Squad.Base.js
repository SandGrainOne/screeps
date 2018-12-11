'use strict';

/**
 * The squad class is the base class for all type of squads. 
 */
class SquadBase {
    /**
     * Initializes a new instance of the squad class with the specified name.
     * 
     * @param {string} name - The name of the squad
     */
    constructor (name) {
        this.name = name;
        
        this._cache = {};
    }

    get memory () {
        if (!_.isObject(Memory.squads[this.name])) {
            Memory.squads[this.name] = {};
        }
        return Memory.squads[this.name];
    }

    get type () {
        return this.memory.type
    }
}

module.exports = SquadBase;
