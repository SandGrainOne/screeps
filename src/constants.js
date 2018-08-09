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

    "BODY": {
        "W3N78": "W3N78"
    },
    "EXIT": {
        "W3N79": {
            "7": { x: 0, y: 22 } // LEFT
        },
        "W4N78": {
            "7": { x: 0, y: 33 } // LEFT
        },
        "W4N79": {
            "3": { x: 49, y: 22 } // RIGHT
        },
        "W5N78": {
            "1": { x: 17, y: 0 }, // TOP
            "3": { x: 49, y: 33 } // RIGHT
        },
        "W5N79": {
            "5": { x: 17, y: 49 } // BOTTOM
        }
    }
}

module.exports = constants;