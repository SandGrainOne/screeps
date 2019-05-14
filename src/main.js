'use strict';

global.os = {};

require('./os.config');
require('./os.code');
require('./os.logger');
require('./os.profiler');

let Empire = require('./Empire');

const load = _.round(Game.cpu.getUsed());
os.logger.warning('Script reloaded. CPU used: ' + load + ', Bucket: ' + Game.cpu.bucket);

// Ensure that the empire memory and state is up to date with what the code expects.
os.code.update();

module.exports.loop = function () {
    // Make the empire available from the gobal scope
    let empire = new Empire();
    global.Empire = empire;

    // Wrap all rooms and creeps in custom logic and make them easily available.
    empire.prepare();

    for (let room of empire.rooms.values()) {
        let rule = null;

        if (room.name === 'E68N84x') {
            rule = {
                'homeRoom': 'E67N84',
                'jobs': {
                    'attacker': { 'count': 1, 'body': 'AAAMMM' },
                    // 'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'hauler': { 'count': 2, 'body': 'WCCCCCCCMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' }
                }
            };
        }

        if (room.name === 'E67N84') {
            rule = {
                'homeRoom': room.name,
                'jobs': {
                    'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWCMMM' },
                    'upgrader': { 'count': 3, 'body': 'WWWWWWWCCCMMMMM' },
                    'linker': { 'count': room.jobs.linkers, 'body': 'CCCCCCMMM' },
                    'builder': { 'count': 2, 'body': 'WWWWWCCCCCMMMMM' },
                    'hauler': { 'count': 3, 'body': 'CCCCCCCCMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWCMMM' },
                    'refueler': { 'count': room.jobs.refuelers, 'body': 'CCCCMM' }
                }
            };
        }

        if (room.name === 'E68N81') {
            rule = {
                'homeRoom': 'E69N81',
                'jobs': {
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'hauler': { 'count': 2, 'body': 'WCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' }
                }
            };
        }

        if (room.name === 'E69N81') {
            rule = {
                'homeRoom': room.name,
                'jobs': {
                    'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                    'linker': { 'count': room.jobs.linkers, 'body': 'CCCCCCCCCCCCCCCCMMMM' },
                    'upgrader': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                    'builder': { 'count': 2, 'body': 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 1, 'body': 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' },
                    'refueler': { 'count': room.jobs.refuelers, 'body': 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' }
                }
            };
        }

        if (room.name === 'E78N82') {
            rule = {
                'homeRoom': 'E78N83',
                'jobs': {
                    'attacker': { 'count': 1, 'body': 'AAAMMM' },
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'hauler': { 'count': 2, 'body': 'WCCCCCCCMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' }
                }
            };
        }

        if (room.name === 'E78N83') {
            rule = {
                'homeRoom': room.name,
                'jobs': {
                    'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWCMMM' },
                    'upgrader': { 'count': 3, 'body': 'WWWWWWWCCCMMMMM' },
                    'linker': { 'count': room.jobs.linkers, 'body': 'CCCCCCMMM' },
                    'builder': { 'count': 2, 'body': 'WWWWWCCCCCMMMMM' },
                    'hauler': { 'count': 3, 'body': 'CCCCCCMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWCMMM' },
                    'refueler': { 'count': room.jobs.refuelers, 'body': 'CCCCMM' }
                }
            };
        }

        if (room.name === 'E77N83') {
            rule = {
                'homeRoom': 'E76N83',
                'jobs': {
                    'dismantler': { 'count': 2, 'body': 'WWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMMMMMMM' },
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'builder': { 'count': 1, 'body': 'WWCCCMMMMM' },
                    'hauler': { 'count': 3, 'body': 'WCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' }
                }
            };
        }

        if (room.name === 'E76N84') {
            rule = {
                'homeRoom': 'E76N83',
                'jobs': {
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                    'builder': { 'count': 1, 'body': 'WCCCCMMMMM' },
                    'hauler': { 'count': 3, 'body': 'WCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWWCCCMMMMM' },
                    'patroler': { 'count': 1, 'body': 'MMMMMMMMMMMMMMMMMMMMMMMMRRRRRRRRRRRRRRRRRRRRMHHHHH' }
                }
            };
        }

        if (room.name === 'E75N83') {
            rule = {
                'homeRoom': 'E76N83',
                'jobs': {
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'hauler': { 'count': 2, 'body': 'WCCCCCCCCCCCCCCMMMMMMMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' }
                }
            };
        }

        if (room.name === 'E76N83') {
            rule = {
                'homeRoom': room.name,
                'jobs': {
                    'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                    'linker': { 'count': room.jobs.linkers, 'body': 'CCCCCCCCCCCCCCCCMMMM' },
                    'upgrader': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                    'builder': { 'count': 2, 'body': 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 2, 'body': 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' },
                    'refueler': { 'count': room.jobs.refuelers, 'body': 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' }
                }
            };
        }

        if (room.name === 'E73N82') {
            rule = {
                'homeRoom': 'E74N81',
                'jobs': {
                    'hauler': { 'count': 1, 'body': 'WCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMMMMMMMMM' },
                    'dismantler': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMMMMMMM' }
                }
            };
        }

        if (room.name === 'E74N82') {
            rule = {
                'homeRoom': 'E74N81',
                'jobs': {
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'hauler': { 'count': 2, 'body': 'WCCCCCCCCCCCCCCMMMMMMMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' }
                }
            };
        }

        if (room.name === 'E75N81') {
            rule = {
                'homeRoom': 'E74N81',
                'jobs': {
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'hauler': { 'count': 2, 'body': 'WCCCCCCCCCCCCCCMMMMMMMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' }
                }
            };
        }

        if (room.name === 'E74N81') {
            rule = {
                'homeRoom': room.name,
                'jobs': {
                    'dismantler': { 'count': room.jobs.dismantlers, 'body': 'WWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMMMMMMM' },
                    'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                    'linker': { 'count': room.jobs.linkers, 'body': 'CCCCCCCCCCCCCCCCMMMM' },
                    'upgrader': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                    'builder': { 'count': 2, 'body': 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 2, 'body': 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' },
                    'refueler': { 'count': room.jobs.refuelers, 'body': 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' }
                }
            };
        }

        if (room.name === 'E67N87') {
            rule = {
                'homeRoom': 'E71N87',
                'jobs': {
                    'hauler': { 'count': 1, 'body': 'WCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMMMMMMMMM' },
                    'dismantler': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMMMMMMM' }
                }
            };
        }

        if (room.name === 'E69N89') {
            rule = {
                'homeRoom': 'E71N87',
                'jobs': {
                    'hauler': { 'count': 1, 'body': 'WCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMMMMMMMMM' },
                    'dismantler': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMMMMMMM' }
                }
            };
        }

        if (room.name === 'E71N88') {
            rule = {
                'homeRoom': 'E71N87',
                'jobs': {
                    'dismantler': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMMMMMMM' },
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'builder': { 'count': 1, 'body': 'WWCCCMMMMM' },
                    'hauler': { 'count': 3, 'body': 'WCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMM' }
                }
            };
        }

        if (room.name === 'E71N87') {
            rule = {
                'homeRoom': room.name,
                'jobs': {
                    'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                    'builder': { 'count': 2, 'body': 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                    'upgrader': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                    'hauler': { 'count': 3, 'body': 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' },
                    'linker': { 'count': room.jobs.linkers, 'body': 'CCCCCCCCCCCCCCCCMMMM' },
                    'refueler': { 'count': room.jobs.refuelers, 'body': 'CCCCCCCCCCCCMMMMMM' }
                }
            };
        }

        if (room.name === 'E73N84') {
            rule = {
                'homeRoom': 'E73N87',
                'jobs': {
                    'hauler': { 'count': 2, 'body': 'WCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMMMMMMMMM' },
                    'dismantler': { 'count': 2, 'body': 'WWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMMMMMMM' }
                }
            };
        }

        if (room.name === 'E73N86') {
            rule = {
                'homeRoom': 'E73N85',
                'jobs': {
                    'attacker': { 'count': 1, 'body': 'AAAMMM' },
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'hauler': { 'count': 2, 'body': 'WCCCCCCCMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' }
                }
            };
        }

        if (room.name === 'E73N85') {
            rule = {
                'homeRoom': room.name,
                'jobs': {
                    'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWCMMM' },
                    'upgrader': { 'count': 3, 'body': 'WWWWWWWCCCMMMMM' },
                    'linker': { 'count': room.jobs.linkers, 'body': 'CCCCCCMMM' },
                    'builder': { 'count': 2, 'body': 'WWWWWCCCCCMMMMM' },
                    'hauler': { 'count': 3, 'body': 'CCCCCCCCMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWCMMM' },
                    'refueler': { 'count': room.jobs.refuelers, 'body': 'CCCCMM' }
                }
            };
        }

        if (room.name === 'E74N86') {
            rule = {
                'homeRoom': 'E73N87',
                'jobs': {
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                    'builder': { 'count': 1, 'body': 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 3, 'body': 'WCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWWCCCMMMMM' },
                    'patroler': { 'count': 1, 'body': 'MMMMMMMMMMMMMMMMMMMMMMMMRRRRRRRRRRRRRRRRRRRRMHHHHH' }
                }
            };
        }

        if (room.name === 'E73N88') {
            rule = {
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
                'homeRoom': room.name,
                'jobs': {
                    'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
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
                'homeRoom': 'E75N87',
                'jobs': {
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                    'builder': { 'count': 1, 'body': 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 3, 'body': 'WCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWWCCCMMMMM' },
                    'patroler': { 'count': 1, 'body': 'MMMMMMMMMMMMMMMMMMMMMMMMRRRRRRRRRRRRRRRRRRRRMHHHHH' }
                }
            };
        }

        if (room.name === 'E72N88') {
            rule = {
                'homeRoom': 'E75N89',
                'jobs': {
                    'hauler': { 'count': 1, 'body': 'WCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMMMMMMMMM' },
                    'dismantler': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMMMMMMM' }
                }
            };
        }

        if (room.name === 'E72N89') {
            rule = {
                'homeRoom': 'E75N89',
                'jobs': {
                    'hauler': { 'count': 1, 'body': 'WCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMMMMMMMMM' },
                    'dismantler': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMMMMMMM' }
                }
            };
        }

        if (room.name === 'E74N89') {
            rule = {
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
                'homeRoom': room.name,
                'jobs': {
                    'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
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
                'homeRoom': room.name,
                'jobs': {
                    'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
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
                'homeRoom': 'E75N87',
                'jobs': {
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 1, 'body': 'WCCCCCCCCCMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' }
                }
            };
        }

        if (room.name === 'E76N87') {
            rule = {
                'homeRoom': 'E75N87',
                'jobs': {
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 1, 'body': 'WCCCCCCCCCMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' }
                }
            };
        }

        if (room.name === 'E75N87') {
            rule = {
                'homeRoom': room.name,
                'jobs': {
                    'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
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
                'homeRoom': 'E77N85',
                'jobs': {
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                    'patroler': { 'count': 1, 'body': 'MMMMMMMMMMMMMMMMMMMMMMMMRRRRRRRRRRRRRRRRRRRRMHHHHH' },
                    'builder': { 'count': 1, 'body': 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 1, 'body': 'WCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' }
                }
            };
        }

        if (room.name === 'E75N85') {
            rule = {
                'homeRoom': 'E77N85',
                'jobs': {
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                    'builder': { 'count': 1, 'body': 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 4, 'body': 'WCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWWCCCMMMMM' }
                }
            };
        }

        if (room.name === 'E77N86') {
            rule = {
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
                'homeRoom': room.name,
                'jobs': {
                    'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                    'linker': { 'count': room.jobs.linkers, 'body': 'CCCCCCCCCCCCCCCCMMMM' },
                    'upgrader': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                    'builder': { 'count': 2, 'body': 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 2, 'body': 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' },
                    'refueler': { 'count': room.jobs.refuelers, 'body': 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' }
                }
            };
        }

        if (room.name === 'E78N89') {
            rule = {
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
                'homeRoom': room.name,
                'jobs': {
                    'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
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
                'homeRoom': room.name,
                'jobs': {
                    'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
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
                'homeRoom': room.name,
                'jobs': {
                    'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                    'linker': { 'count': room.jobs.linkers, 'body': 'CCCCCCCCCCCCCCCCMMMM' },
                    'upgrader': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                    'builder': { 'count': 2, 'body': 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 1, 'body': 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' },
                    'refueler': { 'count': room.jobs.refuelers, 'body': 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' }
                }
            };
        }

        if (room.name === 'E79N84') {
            rule = {
                'homeRoom': 'E79N85',
                'jobs': {
                    'settler': { 'count': room.jobs.settlers, 'body': 'LLMM' },
                    'attacker': { 'count': 1, 'body': 'TTTTTTTTTTAAAAAMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 3, 'body': 'WCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' }
                }
            };
        }

        if (room.name === 'E79N85') {
            rule = {
                'homeRoom': room.name,
                'jobs': {
                    'chemist': { 'count': 1, 'body': 'CCCCCCCCMMMM' },
                    'mineralminer': { 'count': room.jobs.mineralminers, 'body': 'WWWWWWWWWWWWWWWWWWWWWWWWWCCCCCMMMMMMMMMMMMMMMMMMMM' },
                    'linker': { 'count': room.jobs.linkers, 'body': 'CCCCCCCCCCCCCCCCMMMM' },
                    'upgrader': { 'count': 1, 'body': 'WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM' },
                    'builder': { 'count': 1, 'body': 'WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM' },
                    'hauler': { 'count': 1, 'body': 'CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM' },
                    'miner': { 'count': room.jobs.miners, 'body': 'WWWWWWCCMMMM' },
                    'refueler': { 'count': room.jobs.refuelers, 'body': 'CCCCCCCCCCCCMMMMMM' }
                }
            };
        }

        room.createJobs();

        if (rule !== null) {
            let roomPop = empire.creeps[room.name];

            if (roomPop === undefined) {
                roomPop = {};
            }

            for (let job in rule.jobs) {
                let creepCount = roomPop[job + 's'] === undefined ? 0 : roomPop[job + 's'].length;
                if (creepCount < rule.jobs[job].count) {
                    empire.createCreep(job, rule.jobs[job].body, rule.homeRoom, room.name);
                }
            }
        }

        // Perform all room logic
        room.run();
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
