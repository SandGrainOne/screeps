'use strict';

let code = require('./code');
let Empire = require('./Empire');

module.exports.loop = function () {
    // Ensure that the empire is up to date with what the code expects.
    code.update();

    // Make the empire available from the gobal scope
    let empire = new Empire();
    global.Empire = empire;

    // Wrap all rooms and creeps in custom logic and make them easily available.
    empire.prepare();

    for (let roomName in empire.rooms) {
        var room = empire.rooms[roomName];

        if (room.isVisible) {
            // Perform all room logic.
            room.run();
        }

        // TEMPORARY To be done as a step during analysis.
        room.createJobs();

        let rule = null;

        if (room.name === 'sim') {
            rule = {
                'spawnName': 'Spawn1',
                'homeRoom': room.name,
                'jobs': {
                    'miner': { 'count': room.jobs.miners, 'body': 'WCMM' }
                }
            };
        }

        if (room.name === 'E74N86') {
            rule = {
                'spawnName': 'Arna',
                'homeRoom': 'E73N87',
                'jobs': {
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWCCMMMMMM' },
                    'builder': { 'count': 1, 'body': 'WWWWWWCCCCCCCCCCCCCCMMMMMMMMMM' },
                    'hauler': { 'count': 3, 'body': 'WCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWWCCCMMMMM' },
                    'patroler': { 'count': 1, 'body': 'MMMMMMMMMMMMMMMMMMMMMMMMRRRRRRRRRRRRRRRRRRRRMHHHHH' }
                }
            };
        }

        if (room.name === 'E73N88') {
            rule = {
                'spawnName': 'Skien',
                'homeRoom': 'E73N87',
                'jobs': {
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 2, 'body': 'WCCCCCCCCCMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMM' }
                }
            };
        }

        if (room.name === 'E74N87') {
            rule = {
                'spawnName': 'Skien',
                'homeRoom': 'E73N87',
                'jobs': {
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 2, 'body': 'WCCCCCCCCCMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMM' }
                }
            };
        }

        if (room.name === 'E73N87') {
            rule = {
                'spawnName': 'Grimstad',
                'homeRoom': room.name,
                'jobs': {
                    'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWCCMMMM' },
                    'builder': { 'count': 2, 'body': 'WWWCCMMM' },
                    'upgrader': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                    'hauler': { 'count': 2, 'body': 'CCCCCCCCCCMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' },
                    'linker': { 'count': 1, 'body': 'CCCCCCCCCCCCCCCCMMMM' },
                    'refueler': { 'count': room.jobs.refuelers, 'body': 'CCCCCCCCCCCCMMMMMM' }
                }
            };
        }

        if (room.name === 'E75N86') {
            rule = {
                'spawnName': 'Mandal',
                'homeRoom': 'E75N87',
                'jobs': {
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWCCMMMMMM' },
                    'builder': { 'count': 1, 'body': 'WWWWWWCCCCCCCCCCCCCCMMMMMMMMMM' },
                    'hauler': { 'count': 3, 'body': 'WCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWWCCCMMMMM' },
                    'patroler': { 'count': 1, 'body': 'MMMMMMMMMMMMMMMMMMMMMMMMRRRRRRRRRRRRRRRRRRRRMHHHHH' }
                }
            };
        }

        if (room.name === 'E74N89') {
            rule = {
                'spawnName': 'Lillesand',
                'homeRoom': 'E75N89',
                'jobs': {
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 1, 'body': 'WCCCCCCCCCCCCCMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' }
                }
            };
        }

        if (room.name === 'E76N89') {
            rule = {
                'spawnName': 'Lillesand',
                'homeRoom': 'E75N89',
                'jobs': {
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 2, 'body': 'WCCCCCCCCCCCCCMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' }
                }
            };
        }

        if (room.name === 'E75N89') {
            rule = {
                'spawnName': 'Kopervik',
                'homeRoom': room.name,
                'jobs': {
                    'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWCCMMMMMMM' },
                    'linker': { 'count': 1, 'body': 'CCCCCCCCCCCCCCCCMMMM' },
                    'upgrader': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                    'builder': { 'count': 2, 'body': 'WWWWWCCCCCCCMMMMMM' },
                    'hauler': { 'count': 2, 'body': 'CCCCCCCCCCMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' },
                    'refueler': { 'count': room.jobs.refuelers, 'body': 'CCCCCCMMM' }
                }
            };
        }

        if (room.name === 'E79N88') {
            rule = {
                'spawnName': 'Hokksund',
                'homeRoom': 'E78N88',
                'jobs': {
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 1, 'body': 'WCCCCCCCCCCCCCMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMM' }
                }
            };
        }

        if (room.name === 'E78N87') {
            rule = {
                'spawnName': 'Hokksund',
                'homeRoom': 'E78N88',
                'jobs': {
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 1, 'body': 'WCCCCCCCCCCCCCMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMM' }
                }
            };
        }

        if (room.name === 'E78N88') {
            rule = {
                'spawnName': 'Farsund',
                'homeRoom': room.name,
                'jobs': {
                    'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWCCCMMMM' },
                    'linker': { 'count': 1, 'body': 'CCCCCCCCCCCCCCCCMMMM' },
                    'upgrader': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                    'builder': { 'count': 2, 'body': 'WWWWWCCCCCMMMMM' },
                    'hauler': { 'count': 3, 'body': 'CCCCCCCCCCMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWCCCMMMM' },
                    'refueler': { 'count': room.jobs.refuelers, 'body': 'CCCCCCCCMMMM' }
                }
            };
        }

        if (room.name === 'E75N88') {
            rule = {
                'spawnName': 'Oppdal',
                'homeRoom': 'E75N87',
                'jobs': {
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 1, 'body': 'CCCCCCCCCCMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' }
                }
            };
        }

        if (room.name === 'E76N87') {
            rule = {
                'spawnName': 'Oppdal',
                'homeRoom': 'E75N87',
                'jobs': {
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 1, 'body': 'CCCCCCCCCCMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' }
                }
            };
        }

        if (room.name === 'E75N87') {
            rule = {
                'spawnName': 'Veum',
                'homeRoom': room.name,
                'jobs': {
                    'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWCCMMMMMMM' },
                    'linker': { 'count': 1, 'body': 'CCCCCCCCCCCCCCCCMMMM' },
                    'upgrader': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                    'builder': { 'count': 3, 'body': 'WWWWWWCCCCCCCCCCCCCCMMMMMMMMMM' },
                    'hauler': { 'count': 2, 'body': 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' },
                    'refueler': { 'count': room.jobs.refuelers, 'body': 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' }
                }
            };
        }

        if (room.name === 'E76N85') {
            rule = {
                'spawnName': 'Kirkenes',
                'homeRoom': 'E77N85',
                'jobs': {
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWCCMMMMMMM' },
                    'patroler': { 'count': 1, 'body': 'MMMMMMMMMMMMMMMMMMMMMMMMRRRRRRRRRRRRRRRRRRRRMHHHHH' },
                    'builder': { 'count': 1, 'body': 'WWWWWWCCCCCCCCCCCCCCMMMMMMMMMM' },
                    'hauler': { 'count': 1, 'body': 'WCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' }
                }
            };
        }

        if (room.name === 'E75N85') {
            rule = {
                'spawnName': 'Kirkenes',
                'homeRoom': 'E77N85',
                'jobs': {
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWCCMMMMMMM' },
                    'builder': { 'count': 1, 'body': 'WWWWWCCCCCCCMMMMMM' },
                    'hauler': { 'count': 4, 'body': 'WCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWWCCCMMMMM' }
                }
            };
        }

        if (room.name === 'E77N86') {
            rule = {
                'spawnName': 'Moss',
                'homeRoom': 'E77N85',
                'jobs': {
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 3, 'body': 'WCCCCCCCCCCCCCCMMMMMMMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' }
                }
            };
        }

        if (room.name === 'E77N85') {
            rule = {
                'spawnName': 'Stavanger',
                'homeRoom': room.name,
                'jobs': {
                    'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWCCMMMMM' },
                    'linker': { 'count': 1, 'body': 'CCCCCCCCCCCCCCCCMMMM' },
                    'upgrader': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                    'builder': { 'count': 2, 'body': 'WWWWWCCCCCCCMMMMMM' },
                    'hauler': { 'count': 2, 'body': 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' },
                    'refueler': { 'count': room.jobs.refuelers, 'body': 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' }
                }
            };
        }

        if (room.name === 'E76N88') {
            rule = {
                'spawnName': 'Bryne',
                'homeRoom': 'E77N88',
                'jobs': {
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 1, 'body': 'WCCCCCCCCCCCCCCCCCMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' }
                }
            };
        }

        if (room.name === 'E76N88') {
            rule = {
                'spawnName': 'Bryne',
                'homeRoom': 'E77N88',
                'jobs': {
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 1, 'body': 'WCCCCCCCCCCCCCCCCCMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' }
                }
            };
        }

        if (room.name === 'E77N87') {
            rule = {
                'spawnName': 'Bryne',
                'homeRoom': 'E77N88',
                'jobs': {
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 2, 'body': 'WCCCCCCCCCCCCCCCCCMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' }
                }
            };
        }

        if (room.name === 'E78N89') {
            rule = {
                'spawnName': 'Horten',
                'homeRoom': 'E77N88',
                'jobs': {
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 2, 'body': 'WCCCCCCCCCCCCCCCCCMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' }
                }
            };
        }

        if (room.name === 'E77N89') {
            rule = {
                'spawnName': 'Horten',
                'homeRoom': 'E77N88',
                'jobs': {
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 1, 'body': 'WCCCCCCCCCMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' }
                }
            };
        }

        if (room.name === 'E77N88') {
            rule = {
                'spawnName': 'Huske',
                'homeRoom': room.name,
                'jobs': {
                    'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWWWWWWCCCMMMMMMMMM' },
                    'linker': { 'count': 1, 'body': 'CCCCCCCCCCCCCCCCMMMM' },
                    'upgrader': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                    'builder': { 'count': 2, 'body': 'WWWWWCCCCCCCMMMMMM' },
                    'hauler': { 'count': 1, 'body': 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' },
                    'refueler': { 'count': room.jobs.refuelers, 'body': 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' }
                }
            };
        }

        if (room.name === 'E78N85') {
            rule = {
                'spawnName': 'Bergen',
                'homeRoom': room.name,
                'jobs': {
                    'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWWWWWWCCCMMMMMMMMM' },
                    'linker': { 'count': 1, 'body': 'CCCCCCCCCCCCCCCCMMMM' },
                    'upgrader': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                    'builder': { 'count': 2, 'body': 'WWWWWCCCCCCCMMMMMM' },
                    'hauler': { 'count': 1, 'body': 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' },
                    'refueler': { 'count': room.jobs.refuelers, 'body': 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' }
                }
            };
        }

        if (room.name === 'E78N86') {
            rule = {
                'spawnName': 'Hamar',
                'homeRoom': 'E79N86',
                'jobs': {
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 1, 'body': 'WCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' }
                }
            };
        }

        let roomPop = empire.creeps[room.name];

        if (!roomPop) {
            roomPop = {};
        }

        if (rule) {
            let spawn = Game.spawns[rule.spawnName];

            if (!spawn || spawn.spawning) {
                continue;
            }

            for (let job in rule.jobs) {
                if ((!roomPop[job + 's'] ? 0 : roomPop[job + 's'].length) < rule.jobs[job].count) {
                    empire.createCreep(job, null, rule.spawnName, rule.jobs[job].body, rule.homeRoom, room.name);
                }
            }

            continue;
        }

        if (room.name === 'E79N86') {
            let homeRoom = room.name;

            let spawnName = 'Rygge';
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {
                if ((!roomPop.chemists ? 0 : roomPop.chemists.length) < 1) {
                    empire.createCreep('chemist', null, spawnName, 'CCCCCCCCMMMM', homeRoom, room.name);
                }

                if ((!roomPop.mineralminers ? 0 : roomPop.mineralminers.length) < room.jobs.mineralminers) {
                    empire.createCreep('mineralminer', null, spawnName, 'WWWWWWWWWWWWWWWWWWWWCCCCMMMMMMMMMMMM', homeRoom, room.name);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 2) {
                    empire.createCreep('builder', null, spawnName, 'WWWWWCCCCCCCMMMMMM', homeRoom, room.name);
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 1) {
                    empire.createCreep('upgrader', null, spawnName, 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM', homeRoom, room.name);
                }

                if ((!roomPop.linkers ? 0 : roomPop.linkers.length) < 1) {
                    empire.createCreep('linker', null, spawnName, 'CCCCCCCCCCCCCCCCMMMM', homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    empire.createCreep('hauler', null, spawnName, 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM', homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    empire.createCreep('miner', null, spawnName, 'WWWWWWCCMMMM', homeRoom, room.name);
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.jobs.refuelers) {
                    empire.createCreep('refueler', null, spawnName, 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM', homeRoom, room.name);
                }
            }
        }

        if (room.name === 'E79N84') {
            let homeRoom = 'E79N85';

            let spawnName = 'Elverum';
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {
                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.jobs.settlers) {
                    empire.createCreep('settler', null, spawnName, 'LLMM', homeRoom, room.name);
                }

                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 2) {
                    empire.createCreep('attacker', null, spawnName, 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM', homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 3) {
                    empire.createCreep('hauler', null, spawnName, 'WCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMM', homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    empire.createCreep('miner', null, spawnName, 'WWWWWWCCMMMM', homeRoom, room.name);
                }
            }
        }

        if (room.name === 'E79N85') {
            let homeRoom = room.name;

            let spawnName = 'Oslo';
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {
                if ((!roomPop.chemists ? 0 : roomPop.chemists.length) < 1) {
                    empire.createCreep('chemist', null, spawnName, 'CCCCCCCCMMMM', homeRoom, room.name);
                }

                if ((!roomPop.mineralminers ? 0 : roomPop.mineralminers.length) < room.jobs.mineralminers) {
                    empire.createCreep('mineralminer', null, spawnName, 'WWWWWWWWWWWWWWWWWWWWCCCCCCMMMMMMMMMMMMM', homeRoom, room.name);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    empire.createCreep('builder', null, spawnName, 'WWWWWCCCCCCCMMMMMM', homeRoom, room.name);
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 1) {
                    empire.createCreep('upgrader', null, spawnName, 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM', homeRoom, room.name);
                }

                if ((!roomPop.linkers ? 0 : roomPop.linkers.length) < 1) {
                    empire.createCreep('linker', null, spawnName, 'CCCCCCCCCCCCCCCCMMMM', homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    empire.createCreep('hauler', null, spawnName, 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM', homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    empire.createCreep('miner', null, spawnName, 'WWWWWWCCMMMM', homeRoom, room.name);
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.jobs.refuelers) {
                    empire.createCreep('refueler', null, spawnName, 'CCCCCCCCMMMM', homeRoom, room.name);
                }
            }
        }

        if (room.isMine) {
            room.performSpawning();
        }
    }

    for (let creepName in empire.creeps.all) {
        empire.creeps.all[creepName].act();
    }

    // Balance the energy in the empire over the rooms.
    empire.balanceEnergy();

    // Perform an analysis of the next 2 rooms in the empire.
    empire.analyzeRooms();
};
