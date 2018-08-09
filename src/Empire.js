'use strict';

/**
 * The Empire class primary purpose is to provide easy access to game objects like creeps and rooms.
 */
class Empire {
     /**
     * Initializes a new instance of the Empire class.
     */
    constructor() {
        Memory.empire = {};
        Memory.empire.creeps = {};

        this._mem = Memory.empire;
    }

    /**
     * This method is responsible for arranging all important game objects in easy to access collections.
     */
    arrange() {
        //this.print("Performing empire tick preparations", false);
    }

    print(input, log = true) {
        if (_.isObject(input)) {
            input = JSON.stringify(input);
        }

        input = '<font style="color:#e6de99">' + input + '</font>';

        if (!log) {
            console.log(input);
            return;
        }

        return input;
    }
}

module.exports = Empire;
