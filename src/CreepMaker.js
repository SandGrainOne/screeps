'use strict';

let C = require('constants');

let CreepBase = require('Creep.Base');

let wrappers = {
    "miner": require('Creep.Miner'),
    "hauler": require('Creep.Hauler'),
    "linker": require('Creep.Linker'),
    "healer": require('Creep.Healer'),
    "chemist": require('Creep.Chemist'),
    "builder": require('Creep.Builder'),
    "settler": require('Creep.Settler'),
    "upgrader": require('Creep.Upgrader'),
    "refueler": require('Creep.Refueler'),
    "defender": require('Creep.Defender'),
    "attacker": require('Creep.Attacker'),
    "patroler": require('Creep.Patroler'),
    "dismantler": require('Creep.Dismantler'),
    "mineralminer": require('Creep.MineralMiner'),
};

class CreepMaker {
    /**
     * Add a layer of job specific logic to the given creep.
     * 
     * @param {Creep} creep - The creep to be wrapped.
     */
    static wrap(creep) {
        let smartCreep = null;

        let job = creep.memory.job;
        if (job && wrappers[job]) {
            smartCreep = new wrappers[job](creep);
        }

        if (!smartCreep) {
            smartCreep = new CreepBase(creep);
        }

        return smartCreep;
    }

    /**
     * Loop through all wrapper classes for creep jobs and get them to analyze a room to
     * identify how many creeps the room will need as well as their body composition.
     * 
     * @param {RoomReal} room - The room to analyze.
     * 
     * @return - Object with all job requirements.
     */
    static defineJobs(room) {
        let jobs = {};

        for (let jobName in wrappers) {
            let job = wrappers[jobName].defineJob(room);
            if (job) {
                jobs[jobName] = job;
            }
        }

        return jobs;
    }

    /**
     * Build a body based on a shortened code.
     * 
     * Eg: 
     * WCMM => [WORK, CARRY, MOVE, MOVE]
     * LLMM => [CLAIM, CLAIM, MOVE, MOVE]
     */
    static buildBody(codeChain) {
        let body = [];

        let codes = Array.from(codeChain);
        for (let code of codes) {
            body.push(C.BODY_PART_CODES[code]);
        }

        return body;
    }
}

module.exports = CreepMaker;