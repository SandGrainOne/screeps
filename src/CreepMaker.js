'use strict';

let C = require('./constants');

let CreepBase = require('./Creep.Base');

let wrappers = {
    'miner': require('./Creep.Miner'),
    'hauler': require('./Creep.Hauler'),
    'linker': require('./Creep.Linker'),
    'healer': require('./Creep.Healer'),
    'chemist': require('./Creep.Chemist'),
    'builder': require('./Creep.Builder'),
    'settler': require('./Creep.Settler'),
    'upgrader': require('./Creep.Upgrader'),
    'refueler': require('./Creep.Refueler'),
    'defender': require('./Creep.Defender'),
    'attacker': require('./Creep.Attacker'),
    'patroler': require('./Creep.Patroler'),
    'assembler': require('./Creep.Assembler'),
    'scavenger': require('./Creep.Scavenger'),
    'dismantler': require('./Creep.Dismantler'),
    'mineralminer': require('./Creep.MineralMiner')
};

/**
 * The CreepMaker class is a static helper class for creating creeps and for wrapping creeps during tick preparation.
 */
class CreepMaker {
    /**
     * Add a layer of job specific logic to the given creep.
     * 
     * @param {Creep} creep - The creep to be wrapped.
     */
    static wrap (creep) {
        let smartCreep = null;

        let job = creep.memory.job;
        if (job && wrappers[job]) {
            smartCreep = new wrappers[job](creep);
        }

        if (!smartCreep) {
            os.logger.warning('Creep ' + creep.name + ' has an invalid job: ' + job);
            smartCreep = new CreepBase(creep);
        }

        return smartCreep;
    }

    static getCost (body) {
        if (!Array.isArray(body) || body.length === 0) {
            return 0;
        }

        let cost = 0;
        for (let i = 0; i < body.length; i++) {
            cost += BODYPART_COST[body[i]];
        }

        return cost;
    }

    static getPriority (jobName) {
        let priorities = {
            'miner': 2,
            'hauler': 3,
            'linker': 4,
            'healer': 8,
            'chemist': 8,
            'builder': 5,
            'settler': 5,
            'upgrader': 5,
            'refueler': 1,
            'defender': 8,
            'attacker': 7,
            'patroler': 6,
            'assembler': 8,
            'scavenger': 9,
            'dismantler': 9,
            'mineralminer': 5
        };

        let priority = priorities[jobName] !== undefined ? priorities[jobName] : 5;

        return priority;
    }

    /**
     * Have the given spawn create a new creep based on the given rule.
     */
    static spawnCreep (spawn, job) {
        if (spawn === null || spawn.spawning !== null) {
            return ERR_BUSY;
        }

        const opts = {
            'memory': {
                'job': job.jobName,
                'work': {
                    'task': null
                },
                'rooms': {
                    'home': job.homeRoom,
                    'work': job.workRoom
                }
            }
        };

        const creepName = CreepMaker.generateName();
        return spawn.spawnCreep(job.body, creepName, opts);
    }

    /**
     * Generate a name that can be used for a new creep.
     */
    static generateName () {
        let isVowel = false;
        let charArray = C.VOWELS;
        let name = charArray[Math.round(Math.random() * (charArray.length - 1))].toUpperCase();

        let nameComplete = false;
        while (!nameComplete) {
            if (isVowel) {
                charArray = C.VOWELS;
            }
            else {
                charArray = C.CONSONANTS;
            }
            isVowel = !isVowel;

            name += charArray[Math.round(Math.random() * (charArray.length - 1))];

            nameComplete = name.length > C.CREEP_NAME_LENGTH && !Empire.creeps.all[name];
        }

        return name;
    }

    /**
     * Build a body based on a shortened code.
     * 
     * Eg: 
     * WCMM => [WORK, CARRY, MOVE, MOVE]
     * LLMM => [CLAIM, CLAIM, MOVE, MOVE]
     */
    static buildBody (codeChain) {
        let body = [];

        let codes = Array.from(codeChain);
        for (let code of codes) {
            body.push(C.BODY_PART_CODES[code]);
        }

        return body;
    }

    /**
     * Loop through all wrapper classes for creep jobs and get them to analyze a room to
     * identify how many creeps the room will need as well as their body composition.
     * 
     * @param {RoomReal} room - The room to analyze.
     * 
     * @return - Object with all job requirements.
     */
    static defineJobs (room) {
        let jobs = {};

        for (let jobName in wrappers) {
            let job = wrappers[jobName].defineJob(room);
            if (job) {
                jobs[jobName] = job;
            }
        }

        return jobs;
    }
}

module.exports = CreepMaker;
