'use strict';

/**
 * Ensure that the state of the live hive is up to date with the code version.
 */
const constants = {
    'USERNAME': 'SandGrainOne',

    'JOB_REFUELER': 'refueler',
    'JOB_MINER': 'miner',
    'JOB_HAULER': 'hauler',

    'ROOM_TYPE_OWNED': 'owned',
    'ROOM_TYPE_RESERVED': 'reserved',
    'ROOM_TYPE_OTHER': 'other',

    'ROOM_STATE_NORMAL': 'normal',
    'ROOM_STATE_INVADED': 'invaded',
    'ROOM_STATE_ATTACKED': 'attacked',

    'TERMINAL_THRESHOLD_ENERGY': 50000,
    'LINK_MINIMUM_TRANSFER': 200,

    'RETIREMENT': 10,

    'SPAWN_PRIORITY_HIGH': 'high',
    'SPAWN_PRIORITY_NORMAL': 'normal',

    'BODY_PART_CODES': {
        'M': MOVE,
        'W': WORK,
        'C': CARRY,
        'A': ATTACK,
        'R': RANGED_ATTACK,
        'H': HEAL,
        'L': CLAIM,
        'T': TOUGH
    },

    'BUILD_COST': BUILD_POWER,
    'REPAIR_COST': REPAIR_POWER * REPAIR_COST,
    'UPGRADE_COST': UPGRADE_CONTROLLER_POWER,
    'HARVEST_ENERGY_GAIN': HARVEST_POWER,
    'HARVEST_MINERAL_GAIN': HARVEST_MINERAL_POWER,

    'EXIT': {
        // Recommended exit locations when going from one room to another.
        // Keep it to a minimum of entries, to cases where creeps otherwise would
        // do massive detours or get stuck on the border.
        'E75N87': {
            'E76N87': { x: 49, y: 26 }
        }
    },

    'CREEP_NAME_LENGTH': 4,
    'VOWELS': ['a', 'e', 'i', 'o', 'u'],
    'CONSONANTS': ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'qu', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z', 'tt', 'ch', 'sh']
};

module.exports = constants;
