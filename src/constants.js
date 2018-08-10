'use strict';

/**
 * Ensure that the state of the live hive is up to date with the code version.
 */
let constants = {
    "USERNAME": "SandGrainOne",

    "JOB_REFUELER": "refueler",
    "JOB_MINER": "miner",
    "JOB_HAULER": "hauler",

    "ROOM_TYPE_OWNED": "owned",
    "ROOM_TYPE_RESERVED": "reserved",
    "ROOM_TYPE_OTHER": "other",

    "ROOM_STATE_NORMAL": "normal",
    "ROOM_STATE_INVADED": "invaded",
    "ROOM_STATE_ATTACKED": "attacked",

    "TERMINAL_THRESHOLD_ENERGY": 50000,

    "RETIREMENT": 10,

    "SPAWN_PRIORITY_HIGH": "high",
    "SPAWN_PRIORITY_NORMAL": "normal",

    "BODY_PART_CODES": {
        "M": MOVE,
        "W": WORK,
        "C": CARRY,
        "A": ATTACK,
        "R": RANGED_ATTACK,
        "H": HEAL,
        "L": CLAIM,
        "T": TOUGH
    },
    
    "BUILD_COST": BUILD_POWER,
    "REPAIR_COST": REPAIR_POWER * REPAIR_COST,
    "UPGRADE_COST": UPGRADE_CONTROLLER_POWER,
    "HARVEST_ENERGY_GAIN": HARVEST_POWER,
    "HARVEST_MINERAL_GAIN": HARVEST_MINERAL_POWER,

    "EXIT": {
        // Recommended exit locations when going from one room to another.
        // Keep it to a minimum of entries,  to cases where creeps otherwise would do massive detours.
        // Better to improve path finding in other ways.
        "E79N86": {
            "E79N85": { x: 49, y: 37 }
        },
        "E77N85": {
            "E77N89": { x: 19, y: 0 },
            "E77N88": { x: 19, y: 0 },
            "E75N87": { x: 19, y: 0 }
        },
        "E77N86": {
            "E77N89": { x: 31, y: 0 },
            "E77N88": { x: 31, y: 0 },
            "E75N87": { x: 31, y: 0 }
        },
        "E77N87": {
            "E75N87": { x: 0, y: 36 }
        },
        "E78N89": {
            "E77N88": { x: 0, y: 39 }
        },
        "E77N88": {
            "E78N89": { x: 39, y: 0 }
        },
        "E77N89": {
            "E77N88": { x: 31, y: 49 }
        },
        "E76N85": {
            "E77N85": { x: 49, y: 31 }
        },
        "E75N87": {
            "E76N87": { x: 49, y: 26 }
        },
        "E75N89": {
            "E76N89": { x: 49, y: 29 }
        },
        "E76N89": {
            "E75N89": { x: 0, y: 29 }
        }
    }
}

module.exports = constants;