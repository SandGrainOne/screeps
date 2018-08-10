'use strict';

let CreepWorker = require('./Creep.Worker');

/**
 * Wrapper class for creeps with logic for a dismantler.
 * Primary purpose of these creeps are to break down both friendly and hostile structures.
 */
class CreepDismantler extends CreepWorker {
    /**
     * Perform dismantler related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work () {
        return false;
    }
}

module.exports = CreepDismantler;
