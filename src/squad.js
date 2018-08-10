'use strict';

/**
 * The squad class is the base class for all type of squads. 
 */
class squad {
    get memory () {
        if (!_.isObject(Memory.squads)) {
            Memory.squads = {};
        }
        return Memory.squads[this.name];
    }

    set memory (value) {
        if (!_.isObject(Memory.squads)) {
            Memory.squads = {};
        }
        Memory.squads[this.name] = value;
    }
}

module.exports = squad;
