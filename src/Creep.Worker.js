'use strict';

let CreepBase = require('Creep.Base');

/**
 * Wrapper class with worker logic for creeps.
 */
class CreepWorker extends CreepBase
{   
    /**
     * Initializes a new instance of the CreepBase class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped with
     * @param {string} job - The job that the wrapped creep should perform
     */
    constructor(creep, job)
    {
        super(creep);
        
        this.job = job;
    }
}

module.exports = CreepWorker;