'use strict';

global.os = {};

require('./os.config');
require('./os.code');
require('./os.logger');
require('./os.profiler');

const CreepMaker = require('./CreepMaker');
const Empire = require('./Empire');

const load = Math.round(Game.cpu.getUsed());
os.logger.warning('Script reloaded. CPU used: ' + load + ', Bucket: ' + Game.cpu.bucket);

// Ensure that the empire memory and state is up to date with what the code expects.
os.code.update();

module.exports.loop = function () {
    // Make the empire available from the gobal scope
    const empire = new Empire();
    global.Empire = empire;

    // Wrap all rooms and creeps in custom logic and make them easily available.
    empire.prepare();

    for (const room of empire.rooms.values()) {
        room.createJobs();

        const rule = getSpawningRules(room);

        if (rule !== null) {
            let roomPop = empire.creeps[room.name];

            if (roomPop === undefined) {
                roomPop = {};
            }

            for (const jobName in rule.jobs) {
                const creepCount = roomPop[jobName + 's'] === undefined ? 0 : roomPop[jobName + 's'].length;
                if (creepCount < rule.jobs[jobName].count) {
                    const body = CreepMaker.buildBody(rule.jobs[jobName].body);
                    const priority = CreepMaker.getPriority(jobName);
                    const spawningRule = {
                        priority: priority,
                        jobName: jobName,
                        body: body,
                        homeRoom: rule.homeRoom,
                        workRoom: room.name
                    };
                    empire.queueCreepSpawn(spawningRule);
                }
            }
        }

        // Perform all room logic
        room.run();
    }

    for (const creepName in empire.creeps.all) {
        empire.creeps.all[creepName].act();
    }

    empire.performSpawning();
    empire.tickObservations();
    empire.balanceEnergy();
    empire.analyzeRooms();

    if (Game.cpu.bucket > 9700) {
        Game.cpu.generatePixel();
    }
};

function getSpawningRules (room) {
    if (room.name === 'E77N82') {
        return {
            homeRoom: room.name,
            jobs: {
                upgrader: { count: 4, body: 'WCMM' },
                builder: { count: 2, body: 'WCMM' },
                hauler: { count: 2, body: 'CCMM' },
                miner: { count: room.jobs.miners, body: 'WCCMMM' },
                refueler: { count: room.jobs.refuelers, body: 'CCMM' }
            }
        };
    }

    if (room.name === 'E57N79') {
        return {
            homeRoom: room.name,
            jobs: {
                chemist: { count: room.jobs.chemists, body: 'CCCCCCCCMMMM' },
                linker: { count: room.jobs.linkers, body: 'CCCCCCCCCCCCCCCCMMMM' },
                upgrader: { count: 2, body: 'WWWWWWWWCCCCCMMMMMMMMMM' },
                builder: { count: 2, body: 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                hauler: { count: 1, body: 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' },
                refueler: { count: room.jobs.refuelers, body: 'CCCCCCCCCCCCMMMMMM' }
            }
        };
    }

    if (room.name === 'E67N84') {
        return {
            homeRoom: room.name,
            jobs: {
                dismantler: { count: room.jobs.dismantlers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWCMMMMMMMMMMMMMMMMMMMMMMMMM' },
                chemist: { count: room.jobs.chemists, body: 'CCCCCCCCMMMM' },
                mineralminer: { count: room.jobs.mineralminers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                linker: { count: room.jobs.linkers, body: 'CCCCCCCCCCCCCCCCMMMM' },
                upgrader: { count: 1, body: 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                builder: { count: 2, body: 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                hauler: { count: 1, body: 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' },
                refueler: { count: room.jobs.refuelers, body: 'CCCCCCCCCCCCMMMMMM' }
            }
        };
    }

    if (room.name === 'E62N81') {
        return {
            homeRoom: room.name,
            jobs: {
                dismantler: { count: room.jobs.dismantlers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWCMMMMMMMMMMMMMMMMMMMMMMMMM' },
                chemist: { count: room.jobs.chemists, body: 'CCCCCCCCMMMM' },
                mineralminer: { count: room.jobs.mineralminers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                linker: { count: room.jobs.linkers, body: 'CCCCCCCCCCCCCCCCMMMM' },
                upgrader: { count: 1, body: 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                builder: { count: 1, body: 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                hauler: { count: 1, body: 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' },
                refueler: { count: room.jobs.refuelers, body: 'CCCCCCCCCCCCMMMMMM' }
            }
        };
    }

    if (room.name === 'E68N87') {
        return {
            homeRoom: room.name,
            jobs: {
                dismantler: { count: room.jobs.dismantlers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWCMMMMMMMMMMMMMMMMMMMMMMMMM' },
                chemist: { count: room.jobs.chemists, body: 'CCCCCCCCMMMM' },
                mineralminer: { count: room.jobs.mineralminers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                linker: { count: room.jobs.linkers, body: 'CCCCCCCCCCCCMMMMMM' },
                upgrader: { count: 3, body: 'WWWWWCCCMMMM' },
                builder: { count: 2, body: 'WWCCCCCCMMMMMMMM' },
                hauler: { count: 2, body: 'CCCCCCCCCCCCMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' },
                refueler: { count: room.jobs.refuelers, body: 'CCCCCCCCCCCCMMMMMM' }
            }
        };
    }

    if (room.name === 'E68N81') {
        return {
            homeRoom: 'E69N81',
            jobs: {
                attacker: { count: 1, body: 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                settler: { count: room.jobs.settlers, body: 'LLMM' },
                hauler: { count: 2, body: 'WCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' }
            }
        };
    }

    if (room.name === 'E69N81') {
        return {
            homeRoom: room.name,
            jobs: {
                dismantler: { count: room.jobs.dismantlers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWCMMMMMMMMMMMMMMMMMMMMMMMMM' },
                chemist: { count: room.jobs.chemists, body: 'CCCCCCCCMMMM' },
                mineralminer: { count: room.jobs.mineralminers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                linker: { count: room.jobs.linkers, body: 'CCCCCCCCCCCCCCCCMMMM' },
                upgrader: { count: 1, body: 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                builder: { count: 2, body: 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                hauler: { count: 1, body: 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' },
                refueler: { count: room.jobs.refuelers, body: 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' }
            }
        };
    }

    if (room.name === 'E78N82') {
        return {
            homeRoom: 'E78N83',
            jobs: {
                attacker: { count: 1, body: 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                settler: { count: room.jobs.settlers, body: 'LLMM' },
                hauler: { count: 1, body: 'WCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' }
            }
        };
    }

    if (room.name === 'E78N83') {
        return {
            homeRoom: room.name,
            jobs: {
                dismantler: { count: room.jobs.dismantlers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWCMMMMMMMMMMMMMMMMMMMMMMMMM' },
                chemist: { count: room.jobs.chemists, body: 'CCCCCCCCMMMM' },
                mineralminer: { count: room.jobs.mineralminers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                linker: { count: room.jobs.linkers, body: 'CCCCCCCCCCCCCCCCMMMM' },
                upgrader: { count: 1, body: 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                builder: { count: 1, body: 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                hauler: { count: 1, body: 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' },
                refueler: { count: room.jobs.refuelers, body: 'CCCCCCCCCCCCMMMMMM' }
            }
        };
    }

    if (room.name === 'E77N83') {
        return {
            homeRoom: 'E76N83',
            jobs: {
                dismantler: { count: 1, body: 'WWWWWWWWWWWWWWWWWWWWWWWWCMMMMMMMMMMMMMMMMMMMMMMMMM' },
                attacker: { count: 1, body: 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                settler: { count: room.jobs.settlers, body: 'LLMM' },
                builder: { count: 1, body: 'WWCCCMMMMM' },
                hauler: { count: 3, body: 'WCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' }
            }
        };
    }

    if (room.name === 'E76N84x') {
        return {
            homeRoom: 'E76N83',
            jobs: {
                builder: { count: 1, body: 'WCCCCMMMMM' },
                hauler: { count: 3, body: 'WCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWWCCCMMMMM' },
                patroler: { count: 1, body: 'MMMMMMMMMMMMMMMMMMMMMMMMRRRRRRRRRRRRRRRRRRRRMHHHHH' }
            }
        };
    }

    if (room.name === 'E75N83') {
        return {
            homeRoom: 'E76N83',
            jobs: {
                attacker: { count: 1, body: 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                settler: { count: room.jobs.settlers, body: 'LLMM' },
                hauler: { count: 2, body: 'WCCCCCCCCCCCCCCMMMMMMMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' }
            }
        };
    }

    if (room.name === 'E76N83') {
        return {
            homeRoom: room.name,
            jobs: {
                dismantler: { count: room.jobs.dismantlers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWCMMMMMMMMMMMMMMMMMMMMMMMMM' },
                chemist: { count: room.jobs.chemists, body: 'CCCCCCCCMMMM' },
                mineralminer: { count: room.jobs.mineralminers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                linker: { count: room.jobs.linkers, body: 'CCCCCCCCCCCCCCCCMMMM' },
                upgrader: { count: 1, body: 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                builder: { count: 1, body: 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                hauler: { count: 1, body: 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' },
                refueler: { count: room.jobs.refuelers, body: 'CCCCCCCCCCCCMMMMMM' }
            }
        };
    }

    if (room.name === 'E74N82') {
        return {
            homeRoom: 'E74N81',
            jobs: {
                attacker: { count: 1, body: 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                settler: { count: room.jobs.settlers, body: 'LLMM' },
                hauler: { count: 2, body: 'WCCCCCCCCCCCCCCMMMMMMMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' }
            }
        };
    }

    if (room.name === 'E75N81') {
        return {
            homeRoom: 'E74N81',
            jobs: {
                attacker: { count: 1, body: 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                settler: { count: room.jobs.settlers, body: 'LLMM' },
                hauler: { count: 2, body: 'WCCCCCCCCCCCCCCMMMMMMMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' }
            }
        };
    }

    if (room.name === 'E74N81') {
        return {
            homeRoom: room.name,
            jobs: {
                dismantler: { count: room.jobs.dismantlers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWCMMMMMMMMMMMMMMMMMMMMMMMMM' },
                chemist: { count: room.jobs.chemists, body: 'CCCCCCCCMMMM' },
                mineralminer: { count: room.jobs.mineralminers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                linker: { count: room.jobs.linkers, body: 'CCCCCCCCCCCCCCCCMMMM' },
                upgrader: { count: 1, body: 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                builder: { count: 2, body: 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                hauler: { count: 2, body: 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' },
                refueler: { count: room.jobs.refuelers, body: 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' }
            }
        };
    }

    if (room.name === 'E71N88') {
        return {
            homeRoom: 'E71N87',
            jobs: {
                settler: { count: room.jobs.settlers, body: 'LLMM' },
                attacker: { count: 1, body: 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                builder: { count: 1, body: 'WWCCCMMMMM' },
                hauler: { count: 3, body: 'WCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMM' }
            }
        };
    }

    if (room.name === 'E71N87') {
        return {
            homeRoom: room.name,
            jobs: {
                dismantler: { count: room.jobs.dismantlers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWCMMMMMMMMMMMMMMMMMMMMMMMMM' },
                chemist: { count: room.jobs.chemists, body: 'CCCCCCCCMMMM' },
                mineralminer: { count: room.jobs.mineralminers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                builder: { count: 2, body: 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                upgrader: { count: 1, body: 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                hauler: { count: 3, body: 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' },
                linker: { count: room.jobs.linkers, body: 'CCCCCCCCCCCCCCCCMMMM' },
                refueler: { count: room.jobs.refuelers, body: 'CCCCCCCCCCCCMMMMMM' }
            }
        };
    }

    if (room.name === 'E73N84') {
        return {
            homeRoom: room.name,
            jobs: {
                upgrader: { count: 4, body: 'WWCMM' },
                builder: { count: 4, body: 'WWCMM' },
                hauler: { count: 2, body: 'CCCCMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWCCMMMMMM' },
                linker: { count: room.jobs.linkers, body: 'CCCCCCCCM' },
                refueler: { count: room.jobs.refuelers, body: 'CCCCMMMM' }
            }
        };
    }

    if (room.name === 'E73N86') {
        return {
            homeRoom: 'E73N85',
            jobs: {
                attacker: { count: 1, body: 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                settler: { count: room.jobs.settlers, body: 'LLMM' },
                hauler: { count: 1, body: 'WCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' }
            }
        };
    }

    if (room.name === 'E73N85') {
        return {
            homeRoom: room.name,
            jobs: {
                dismantler: { count: room.jobs.dismantlers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWCMMMMMMMMMMMMMMMMMMMMMMMMM' },
                chemist: { count: room.jobs.chemists, body: 'CCCCCCCCMMMM' },
                mineralminer: { count: room.jobs.mineralminers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                linker: { count: room.jobs.linkers, body: 'CCCCCCCCCCCCCCCCMMMM' },
                upgrader: { count: 1, body: 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                builder: { count: 1, body: 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                hauler: { count: 1, body: 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' },
                refueler: { count: room.jobs.refuelers, body: 'CCCCCCCCCCCCMMMMMM' }
            }
        };
    }

    if (room.name === 'E74N86x') {
        return {
            homeRoom: 'E73N87',
            jobs: {
                builder: { count: 1, body: 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                hauler: { count: 3, body: 'WCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWWCCCMMMMM' },
                patroler: { count: 1, body: 'MMMMMMMMMMMMMMMMMMMMMMMMRRRRRRRRRRRRRRRRRRRRMHHHHH' }
            }
        };
    }

    if (room.name === 'E73N88') {
        return {
            homeRoom: 'E73N87',
            jobs: {
                settler: { count: room.jobs.settlers, body: 'LLMM' },
                attacker: { count: 1, body: 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                hauler: { count: 2, body: 'WCCCCCCCCCCCCCCCMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMM' }
            }
        };
    }

    if (room.name === 'E74N87') {
        return {
            homeRoom: 'E73N87',
            jobs: {
                settler: { count: room.jobs.settlers, body: 'LLMM' },
                attacker: { count: 1, body: 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                hauler: { count: 2, body: 'WCCCCCCCCCCCCCCCMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMM' }
            }
        };
    }

    if (room.name === 'E73N87') {
        return {
            homeRoom: room.name,
            jobs: {
                dismantler: { count: room.jobs.dismantlers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWCMMMMMMMMMMMMMMMMMMMMMMMMM' },
                chemist: { count: room.jobs.chemists, body: 'CCCCCCCCMMMM' },
                mineralminer: { count: room.jobs.mineralminers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                builder: { count: 2, body: 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                upgrader: { count: 1, body: 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                hauler: { count: 2, body: 'CCCCCCCCCCMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' },
                linker: { count: room.jobs.linkers, body: 'CCCCCCCCCCCCCCCCMMMM' },
                refueler: { count: room.jobs.refuelers + 1, body: 'CCCCCCCCCCCCMMMMMM' }
            }
        };
    }

    if (room.name === 'E75N86x') {
        return {
            homeRoom: 'E75N87',
            jobs: {
                builder: { count: 1, body: 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                hauler: { count: 3, body: 'WCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWWCCCMMMMM' },
                patroler: { count: 1, body: 'MMMMMMMMMMMMMMMMMMMMMMMMRRRRRRRRRRRRRRRRRRRRMHHHHH' }
            }
        };
    }

    if (room.name === 'E74N89') {
        return {
            homeRoom: 'E75N89',
            jobs: {
                settler: { count: room.jobs.settlers, body: 'LLMM' },
                attacker: { count: 1, body: 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                hauler: { count: 1, body: 'WCCCCCCCCCCCCCMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' }
            }
        };
    }

    if (room.name === 'E76N89') {
        return {
            homeRoom: 'E75N89',
            jobs: {
                settler: { count: room.jobs.settlers, body: 'LLMM' },
                attacker: { count: 1, body: 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                hauler: { count: 2, body: 'WCCCCCCCCCCCCCMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' }
            }
        };
    }

    if (room.name === 'E75N89') {
        return {
            homeRoom: room.name,
            jobs: {
                dismantler: { count: room.jobs.dismantlers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWCMMMMMMMMMMMMMMMMMMMMMMMMM' },
                chemist: { count: room.jobs.chemists, body: 'CCCCCCCCMMMM' },
                mineralminer: { count: room.jobs.mineralminers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                linker: { count: room.jobs.linkers, body: 'CCCCCCCCCCCCCCCCMMMM' },
                upgrader: { count: 1, body: 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                builder: { count: 2, body: 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                hauler: { count: 2, body: 'CCCCCCCCCCMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' },
                refueler: { count: room.jobs.refuelers, body: 'CCCCCCMMM' }
            }
        };
    }

    if (room.name === 'E79N88') {
        return {
            homeRoom: 'E78N88',
            jobs: {
                settler: { count: room.jobs.settlers, body: 'LLMM' },
                attacker: { count: 1, body: 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                hauler: { count: 1, body: 'WCCCCCCCCCCCCCMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMM' }
            }
        };
    }

    if (room.name === 'E78N87') {
        return {
            homeRoom: 'E78N88',
            jobs: {
                settler: { count: room.jobs.settlers, body: 'LLMM' },
                attacker: { count: 1, body: 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                hauler: { count: 1, body: 'WCCCCCCCCCCCCCMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMM' }
            }
        };
    }

    if (room.name === 'E78N88') {
        return {
            homeRoom: room.name,
            jobs: {
                dismantler: { count: room.jobs.dismantlers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWCMMMMMMMMMMMMMMMMMMMMMMMMM' },
                chemist: { count: room.jobs.chemists, body: 'CCCCCCCCMMMM' },
                mineralminer: { count: room.jobs.mineralminers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                linker: { count: room.jobs.linkers, body: 'CCCCCCCCCCCCCCCCMMMM' },
                upgrader: { count: 1, body: 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                builder: { count: 2, body: 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                hauler: { count: 3, body: 'CCCCCCCCCCMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWCCCMMMM' },
                refueler: { count: room.jobs.refuelers, body: 'CCCCCCCCMMMM' }
            }
        };
    }

    if (room.name === 'E75N88') {
        return {
            homeRoom: 'E75N87',
            jobs: {
                settler: { count: room.jobs.settlers, body: 'LLMM' },
                attacker: { count: 1, body: 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                hauler: { count: 1, body: 'WCCCCCCCCCMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' }
            }
        };
    }

    if (room.name === 'E76N87') {
        return {
            homeRoom: 'E75N87',
            jobs: {
                settler: { count: room.jobs.settlers, body: 'LLMM' },
                attacker: { count: 1, body: 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                hauler: { count: 1, body: 'WCCCCCCCCCMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' }
            }
        };
    }

    if (room.name === 'E75N87') {
        return {
            homeRoom: room.name,
            jobs: {
                dismantler: { count: room.jobs.dismantlers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWCMMMMMMMMMMMMMMMMMMMMMMMMM' },
                chemist: { count: room.jobs.chemists, body: 'CCCCCCCCMMMM' },
                mineralminer: { count: room.jobs.mineralminers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                linker: { count: room.jobs.linkers, body: 'CCCCCCCCCCCCCCCCMMMM' },
                upgrader: { count: 2, body: 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                builder: { count: 3, body: 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                hauler: { count: 2, body: 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' },
                refueler: { count: room.jobs.refuelers, body: 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' }
            }
        };
    }

    if (room.name === 'E76N85x') {
        return {
            homeRoom: 'E77N85',
            jobs: {
                patroler: { count: 1, body: 'MMMMMMMMMMMMMMMMMMMMMMMMRRRRRRRRRRRRRRRRRRRRMHHHHH' },
                builder: { count: 1, body: 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                hauler: { count: 1, body: 'WCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' }
            }
        };
    }

    if (room.name === 'E75N85x') {
        return {
            homeRoom: 'E77N85',
            jobs: {
                builder: { count: 1, body: 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                hauler: { count: 4, body: 'WCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWWCCCMMMMM' }
            }
        };
    }

    if (room.name === 'E77N86') {
        return {
            homeRoom: 'E77N85',
            jobs: {
                builder: { count: 1, body: 'WWCCCMMMMM' },
                settler: { count: room.jobs.settlers, body: 'LLMM' },
                attacker: { count: 1, body: 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                hauler: { count: 2, body: 'WCCCCCCCCCCCCCCMMMMMMMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' }
            }
        };
    }

    if (room.name === 'E77N85') {
        return {
            homeRoom: room.name,
            jobs: {
                dismantler: { count: room.jobs.dismantlers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWCMMMMMMMMMMMMMMMMMMMMMMMMM' },
                chemist: { count: room.jobs.chemists, body: 'CCCCCCCCMMMM' },
                mineralminer: { count: room.jobs.mineralminers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                linker: { count: room.jobs.linkers, body: 'CCCCCCCCCCCCCCCCMMMM' },
                upgrader: { count: 1, body: 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                builder: { count: 2, body: 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                hauler: { count: 2, body: 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' },
                refueler: { count: room.jobs.refuelers, body: 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' }
            }
        };
    }

    if (room.name === 'E78N89') {
        return {
            homeRoom: 'E77N88',
            jobs: {
                settler: { count: room.jobs.settlers, body: 'LLMM' },
                attacker: { count: 1, body: 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                hauler: { count: 1, body: 'WCCCCCCCCCCCCCCCCCMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' }
            }
        };
    }

    if (room.name === 'E76N88') {
        return {
            homeRoom: 'E77N88',
            jobs: {
                settler: { count: room.jobs.settlers, body: 'LLMM' },
                attacker: { count: 1, body: 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                hauler: { count: 1, body: 'WCCCCCCCCCCCCCCCCCMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' }
            }
        };
    }

    if (room.name === 'E76N88') {
        return {
            homeRoom: 'E77N88',
            jobs: {
                settler: { count: room.jobs.settlers, body: 'LLMM' },
                attacker: { count: 1, body: 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                hauler: { count: 1, body: 'WCCCCCCCCCCCCCCCCCMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' }
            }
        };
    }

    if (room.name === 'E77N87') {
        return {
            homeRoom: 'E77N88',
            jobs: {
                settler: { count: room.jobs.settlers, body: 'LLMM' },
                attacker: { count: 1, body: 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                hauler: { count: 2, body: 'WCCCCCCCCCCCCCCCCCMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' }
            }
        };
    }

    if (room.name === 'E77N89') {
        return {
            homeRoom: 'E77N88',
            jobs: {
                settler: { count: room.jobs.settlers, body: 'LLMM' },
                attacker: { count: 1, body: 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                hauler: { count: 1, body: 'WCCCCCCCCCMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' }
            }
        };
    }

    if (room.name === 'E77N88') {
        return {
            homeRoom: room.name,
            jobs: {
                dismantler: { count: room.jobs.dismantlers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWCMMMMMMMMMMMMMMMMMMMMMMMMM' },
                chemist: { count: room.jobs.chemists, body: 'CCCCCCCCMMMM' },
                mineralminer: { count: room.jobs.mineralminers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                linker: { count: room.jobs.linkers, body: 'CCCCCCCCCCCCCCCCMMMM' },
                upgrader: { count: 1, body: 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                builder: { count: 2, body: 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                hauler: { count: 1, body: 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' },
                refueler: { count: room.jobs.refuelers, body: 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' }
            }
        };
    }

    if (room.name === 'E78N85') {
        return {
            homeRoom: room.name,
            jobs: {
                chemist: { count: room.jobs.chemists, body: 'CCCCCCCCMMMM' },
                mineralminer: { count: room.jobs.mineralminers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                linker: { count: room.jobs.linkers, body: 'CCCCCCCCCCCCCCCCMMMM' },
                upgrader: { count: 1, body: 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                builder: { count: 2, body: 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                hauler: { count: 1, body: 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' },
                refueler: { count: room.jobs.refuelers, body: 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' }
            }
        };
    }

    if (room.name === 'E78N86') {
        return {
            homeRoom: 'E79N86',
            jobs: {
                settler: { count: room.jobs.settlers, body: 'LLMM' },
                attacker: { count: 1, body: 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                hauler: { count: 1, body: 'WCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' }
            }
        };
    }

    if (room.name === 'E79N87') {
        return {
            homeRoom: 'E79N86',
            jobs: {
                settler: { count: room.jobs.settlers, body: 'LLMM' },
                attacker: { count: 1, body: 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                builder: { count: 1, body: 'WCMM' },
                hauler: { count: 2, body: 'WCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' }
            }
        };
    }

    if (room.name === 'E79N86') {
        return {
            homeRoom: room.name,
            jobs: {
                dismantler: { count: room.jobs.dismantlers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWCMMMMMMMMMMMMMMMMMMMMMMMMM' },
                chemist: { count: room.jobs.chemists, body: 'CCCCCCCCMMMM' },
                mineralminer: { count: room.jobs.mineralminers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                linker: { count: room.jobs.linkers, body: 'CCCCCCCCCCCCCCCCMMMM' },
                upgrader: { count: 1, body: 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                builder: { count: 2, body: 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                hauler: { count: 1, body: 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' },
                refueler: { count: room.jobs.refuelers, body: 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' }
            }
        };
    }

    if (room.name === 'E79N84') {
        return {
            homeRoom: 'E79N85',
            jobs: {
                settler: { count: room.jobs.settlers, body: 'LLMM' },
                attacker: { count: 1, body: 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                hauler: { count: 3, body: 'WCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' }
            }
        };
    }

    if (room.name === 'E79N85') {
        return {
            homeRoom: room.name,
            jobs: {
                dismantler: { count: room.jobs.dismantlers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWCMMMMMMMMMMMMMMMMMMMMMMMMM' },
                chemist: { count: room.jobs.chemists, body: 'CCCCCCCCMMMM' },
                mineralminer: { count: room.jobs.mineralminers, body: 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                linker: { count: room.jobs.linkers, body: 'CCCCCCCCCCCCCCCCMMMM' },
                upgrader: { count: 1, body: 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                builder: { count: 1, body: 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                hauler: { count: 1, body: 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                miner: { count: room.jobs.miners, body: 'WWWWWWCCMMMM' },
                refueler: { count: room.jobs.refuelers, body: 'CCCCCCCCCCCCMMMMMM' }
            }
        };
    }

    return null;
};
