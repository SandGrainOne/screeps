'use strict';

os.code = {};

/**
 * Update the live hive to the current code version.
 */
os.code.update = function () {
    // Ensure that a code object is defined. First update.
    if (Memory.code === undefined) {
        Memory.code = {};
    }

    // Ensure that the version is defined. First update.
    if (Memory.code.version === undefined) {
        _setVersion('1.0');
    }

    // Adding the empire memory space
    if (_getVersion() === '1.0') {
        if (Memory.empire === undefined) {
            Memory.empire = {};
        }
        _setVersion('1.1');
    }

    // Adding the squads memory space
    if (_getVersion() === '1.1') {
        if (Memory.squads === undefined) {
            Memory.squads = {};
        }
        _setVersion('1.2');
    }
};

/**
 * Returns current code version.
 */
function _getVersion () {
    return Memory.code.version;
};

/**
 * Sets current code version.
 */
function _setVersion (version) {
    Memory.code.version = version;
};
