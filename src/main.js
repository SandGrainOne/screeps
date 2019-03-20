'use strict';

require('./os');
require('./os.logger');

let code = require('./code');
let Empire = require('./Empire');

const load = _.round(Game.cpu.getUsed());
os.log.warning('Script reloaded. CPU used: ' + load + ', Bucket: ' + Game.cpu.bucket);

// Ensure that the empire memory and state is up to date with what the code expects.
code.update();

module.exports.loop = function () {
    // Make the empire available from the gobal scope
    let empire = new Empire();
    global.Empire = empire;

    // Wrap all rooms and creeps in custom logic and make them easily available.
    empire.prepare();

    for (let room of empire.rooms.values()) {
        if (room.isVisible) {
            // Perform all room logic.
            room.run();
        }

        // TEMPORARY. To be done as a step during analysis.
        room.createJobs();

        let rule = null;

        if (room.name === 'E69N81') {
            rule = {
                'spawnName': 'Ogidosgrad',
                'homeRoom': room.name,
                'jobs': {
                    'builder': { 'count': 2, 'body': 'WWCCCMMMMM' },
                    'upgrader': { 'count': 6, 'body': 'WWCCCMMMMM' },
                    'hauler': { 'count': 4, 'body': 'CCCCCMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWCCMMMM' },
                    'refueler': { 'count': room.jobs.refuelers, 'body': 'CCCCCMMMMM' }
                }
            };
        }

        if (room.name === 'E76N84') {
            rule = {
                'spawnName': 'Molde',
                'homeRoom': 'E77N85',
                'jobs': {
                    'hauler': { 'count': 2, 'body': 'CCCCCCMMMMMM' },
                    'patroler': { 'count': 1, 'body': 'MMMMMMMMMMMMMMMMMMMMMMMMRRRRRRRRRRRRRRRRRRRRMHHHHH' }
                }
            };
        }

        if (room.name === 'E75N83') {
            rule = {
                'spawnName': 'IcichoStad',
                'homeRoom': 'E76N83',
                'jobs': {
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    // 'builder': { 'count': 1, 'body': 'WCCMMM' },
                    'hauler': { 'count': 2, 'body': 'WCCCCCCCCCCCCCCMMMMMMMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' }
                }
            };
        }

        if (room.name === 'E76N83') {
            rule = {
                'spawnName': 'Jessheim',
                'homeRoom': room.name,
                'jobs': {
                    // 'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    // 'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWCCMMMMMM' },
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'builder': { 'count': 2, 'body': 'WWWCCCCCMMMM' },
                    'upgrader': { 'count': 4, 'body': 'WWWWWWWWCCCCMMMM' },
                    'hauler': { 'count': 2, 'body': 'CCCCCCCCCCMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' },
                    'linker': { 'count': room.jobs.linkers, 'body': 'CCCCCCCCCCCCCCCCMMMM' },
                    'refueler': { 'count': room.jobs.refuelers, 'body': 'CCCCCCCCCCCCMMMMMM' }
                }
            };
        }

        if (room.name === 'E74N82') {
            rule = {
                'spawnName': 'Hoksund',
                'homeRoom': 'E74N81',
                'jobs': {
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    // 'builder': { 'count': 1, 'body': 'WCCMMM' },
                    'hauler': { 'count': 2, 'body': 'WCCCCCCCCCCCCCCMMMMMMMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' }
                }
            };
        }

        if (room.name === 'E74N81') {
            rule = {
                'spawnName': 'Tananger',
                'homeRoom': room.name,
                'jobs': {
                    // 'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    // 'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWCCMMMMM' },
                    'linker': { 'count': room.jobs.linkers, 'body': 'CCCCCCCCCCCCCCCCMMMM' },
                    'upgrader': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                    'builder': { 'count': 2, 'body': 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 2, 'body': 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' },
                    'refueler': { 'count': room.jobs.refuelers, 'body': 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' }
                }
            };
        }

        if (room.name === 'E71N88') {
            rule = {
                'spawnName': 'Eiker',
                'homeRoom': 'E71N87',
                'jobs': {
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'builder': { 'count': 1, 'body': 'WWCCCMMMMM' },
                    'hauler': { 'count': 2, 'body': 'WCCCCCCCCCCCCCCCMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMM' }
                }
            };
        }

        if (room.name === 'E71N87') {
            rule = {
                'spawnName': 'Otta',
                'homeRoom': room.name,
                'jobs': {
                    // 'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    // 'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWCCMMMMMM' },
                    'builder': { 'count': 2, 'body': 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                    'upgrader': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                    'hauler': { 'count': 3, 'body': 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' },
                    'linker': { 'count': room.jobs.linkers, 'body': 'CCCCCCCCCCCCCCCCMMMM' },
                    'refueler': { 'count': room.jobs.refuelers, 'body': 'CCCCCCCCCCCCMMMMMM' }
                }
            };
        }

        if (room.name === 'E74N86') {
            rule = {
                'spawnName': 'Arna',
                'homeRoom': 'E73N87',
                'jobs': {
                    // 'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWCCMMMMMM' },
                    'builder': { 'count': 1, 'body': 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
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
                    'hauler': { 'count': 2, 'body': 'WCCCCCCCCCCCCCCCMMMMMMMM' },
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
                    'hauler': { 'count': 2, 'body': 'WCCCCCCCCCCCCCCCMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMM' }
                }
            };
        }

        if (room.name === 'E73N87') {
            rule = {
                'spawnName': 'Grimstad',
                'homeRoom': room.name,
                'jobs': {
                    // 'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    // 'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWCCMMMM' },
                    'builder': { 'count': 2, 'body': 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                    'upgrader': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                    'hauler': { 'count': 2, 'body': 'CCCCCCCCCCMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' },
                    'linker': { 'count': room.jobs.linkers, 'body': 'CCCCCCCCCCCCCCCCMMMM' },
                    'refueler': { 'count': room.jobs.refuelers, 'body': 'CCCCCCCCCCCCMMMMMM' }
                }
            };
        }

        if (room.name === 'E75N86') {
            rule = {
                'spawnName': 'Mandal',
                'homeRoom': 'E75N87',
                'jobs': {
                    // 'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWCCMMMMMM' },
                    'builder': { 'count': 1, 'body': 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
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
                    // 'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    // 'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWCCMMMMMMM' },
                    'linker': { 'count': room.jobs.linkers, 'body': 'CCCCCCCCCCCCCCCCMMMM' },
                    'upgrader': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                    'builder': { 'count': 2, 'body': 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
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
                    // 'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    // 'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWCCCMMMM' },
                    'linker': { 'count': room.jobs.linkers, 'body': 'CCCCCCCCCCCCCCCCMMMM' },
                    'upgrader': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                    'builder': { 'count': 2, 'body': 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
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
                    // 'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    // 'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWCCMMMMMM' },
                    'linker': { 'count': room.jobs.linkers, 'body': 'CCCCCCCCCCCCCCCCMMMM' },
                    'upgrader': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                    'builder': { 'count': 3, 'body': 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
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
                    // 'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWCCMMMMMMM' },
                    'patroler': { 'count': 1, 'body': 'MMMMMMMMMMMMMMMMMMMMMMMMRRRRRRRRRRRRRRRRRRRRMHHHHH' },
                    'builder': { 'count': 1, 'body': 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 1, 'body': 'WCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' }
                }
            };
        }

        if (room.name === 'E75N85') {
            rule = {
                'spawnName': 'Kirkenes',
                'homeRoom': 'E77N85',
                'jobs': {
                    // 'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWCCMMMMMMM' },
                    'builder': { 'count': 1, 'body': 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
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
                    'builder': { 'count': 1, 'body': 'WWCCCMMMMM' },
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 2, 'body': 'WCCCCCCCCCCCCCCMMMMMMMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' }
                }
            };
        }

        if (room.name === 'E77N85') {
            rule = {
                'spawnName': 'Stavanger',
                'homeRoom': room.name,
                'jobs': {
                    // 'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    // 'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWCCMMMMM' },
                    'linker': { 'count': room.jobs.linkers, 'body': 'CCCCCCCCCCCCCCCCMMMM' },
                    'upgrader': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                    'builder': { 'count': 2, 'body': 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
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
                    // 'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    // 'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWWWWWWCCCMMMMMMMMM' },
                    'linker': { 'count': room.jobs.linkers, 'body': 'CCCCCCCCCCCCCCCCMMMM' },
                    'upgrader': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                    'builder': { 'count': 2, 'body': 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
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
                    // 'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    // 'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWWWWWWCCCMMMMMMMMM' },
                    'linker': { 'count': room.jobs.linkers, 'body': 'CCCCCCCCCCCCCCCCMMMM' },
                    'upgrader': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                    'builder': { 'count': 2, 'body': 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
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

        if (room.name === 'E79N87') {
            rule = {
                'spawnName': 'Narvik',
                'homeRoom': 'E79N86',
                'jobs': {
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 2, 'body': 'WCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' }
                }
            };
        }

        if (room.name === 'E79N86') {
            rule = {
                'spawnName': 'Rygge',
                'homeRoom': room.name,
                'jobs': {
                    // 'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    // 'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWWWWWWWWWWWCCCCMMMMMMMMMMMM' },
                    'linker': { 'count': room.jobs.linkers, 'body': 'CCCCCCCCCCCCCCCCMMMM' },
                    'upgrader': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                    'builder': { 'count': 2, 'body': 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 1, 'body': 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' },
                    'refueler': { 'count': room.jobs.refuelers, 'body': 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' }
                }
            };
        }

        if (room.name === 'E81N84x') {
            rule = {
                'spawnName': 'Larvik',
                'homeRoom': 'E79N85',
                'jobs': {
                    'settler': { 'count': 1, 'body': 'TTTTTTTTTTTTTTTTTTTM' }
                }
            };
        }

        if (room.name === 'E79N84') {
            rule = {
                'spawnName': 'Elverum',
                'homeRoom': 'E79N85',
                'jobs': {
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'attacker': { 'count': 2, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 3, 'body': 'WCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' }
                }
            };
        }

        if (room.name === 'E79N85') {
            rule = {
                'spawnName': 'Oslo',
                'homeRoom': room.name,
                'jobs': {
                    // 'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    // 'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWWWWWWWWWWWCCCCCCMMMMMMMMMMMMM' },
                    'linker': { 'count': room.jobs.linkers, 'body': 'CCCCCCCCCCCCCCCCMMMM' },
                    'upgrader': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                    'builder': { 'count': 1, 'body': 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 1, 'body': 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' },
                    'refueler': { 'count': room.jobs.refuelers, 'body': 'CCCCCCCCCCCCMMMMMM' }
                }
            };
        }

        if (rule) {
            let spawn = Game.spawns[rule.spawnName];

            if (!_.isUndefined(spawn) && !spawn.spawning) {
                let roomPop = empire.creeps[room.name];

                if (_.isUndefined(roomPop)) {
                    roomPop = {};
                }

                for (let job in rule.jobs) {
                    if ((!roomPop[job + 's'] ? 0 : roomPop[job + 's'].length) < rule.jobs[job].count) {
                        empire.createCreep(job, null, rule.spawnName, rule.jobs[job].body, rule.homeRoom, room.name);
                    }
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

    empire.tickObservations();

    // Balance the energy in the empire over the rooms.
    empire.balanceEnergy();

    // Perform an analysis of the next 2 rooms in the empire.
    empire.analyzeRooms();
};
