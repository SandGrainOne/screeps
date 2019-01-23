'use strict';

let SquadBase = require('./Squad.Base');

/**
 * The SquadDummy class is a temporary Squad type used for some simple testing.
 */
class SquadDummy extends SquadBase {
    /**
     * Initializes a new instance of the SquadDummy class with the specified name.
     * 
     * @param {string} name - The name of the squad
     */
    constructor (name) {
        super(name);
    }
}

module.exports = SquadDummy;
