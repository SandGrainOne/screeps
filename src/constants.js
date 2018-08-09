'use strict';

/**
 * Ensure that the state of the live hive is up to date with the code version.
 */
let constants = {
    "USERNAME": "SandGrainOne",

    "ROOM_TYPE_OWNED": "owned",
    "ROOM_TYPE_RESERVED": "reserved",
    "ROOM_TYPE_OTHER": "other",

    "ROOM_STATE_NORMAL": "normal",
    "ROOM_STATE_INVADED": "invaded",
    "ROOM_STATE_ATTACKED": "attacked",

    "RETIREMENT": 10,

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
            "E76N89": { x: 19, y: 0 },
            "E74N89": { x: 19, y: 0 }
        },
        "E77N86": {
            "E77N89": { x: 31, y: 0 },
            "E77N88": { x: 31, y: 0 },
            "E76N89": { x: 31, y: 0 },
            "E74N89": { x: 31, y: 0 }
        },
        "E78N89": {
            "E77N88": { x: 0, y: 39 }
        },
        "E77N88": {
            "E78N89": { x: 39, y: 0 }
        }
    }
}

module.exports = constants;