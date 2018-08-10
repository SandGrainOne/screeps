'use strict';

let C = require('constants');

let CreepBase = require('Creep.Base');

let wrappers = {
    "miner": require('Creep.Miner'),
    "hauler": require('Creep.Hauler'),
    "broker": require('Creep.Broker'),
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
    "balancer": require('Creep.Balancer'),
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
        if (job) {
            if (job.name) {
                job = job.name;
            }
            smartCreep = new wrappers[job](creep);
        }

        if (!smartCreep) {
            smartCreep = new CreepBase(creep);
        }

        return smartCreep;
    }

    static makeBody(room) {
        let jobs = {};

        for (let jobName in wrappers) {
            jobs[jobName] = wrappers[jobName].makeBody(room);
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