'use strict';

/**
 * Ensure that the state of the live hive is up to date with the code version.
 */
let code = {
    /**
     * Returns current code version.
     */
    getVersion: function () {
        return Memory.code.version;
    },

    /**
     * Sets current code version.
     */
    setVersion: function (version) {
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
            this.setVersion("1.0");
        }
        
        if (this.getVersion() === "1.0") {
            // No work todo. No new versions.
        }
    }
}

module.exports = code;