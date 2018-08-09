'use strict';

/**
 * Ensure that the state of the live hive is up to date with the code version.
 */
let code = {
    /**
     * Returns current code version.
     */
    _getVersion: function () {
        return Memory.code.version;
    },

    /**
     * Sets current code version.
     */
    _setVersion: function (version) {
        Memory.code.version = version;
    },

    /**
     * Update the live hive to the current code version.
     */
    update: function ()  {
        // Ensure that a code object is defined. First update.
        if (Memory.code === undefined)  {
            Memory.code = {};
        }

        // Ensure that the version is defined. First update.
        if (Memory.code.version === undefined)  {
            this._setVersion("1.0");
        }

        // Adding the empire memory space
        if (this._getVersion() === "1.0") {
            if (Memory.empire === undefined) {
                Memory.empire = {};
            }
            if (Memory.empire.reservations === undefined) {
                Memory.empire.reservations = {};
            }
            this._setVersion("1.1");
        }
    }
}

module.exports = code;