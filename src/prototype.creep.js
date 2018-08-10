'use strict';

/**
 * This module holds all changes to the creep prototype provided by the game.
 */
Creep.prototype.act = function() {
    this.say("acting");
    console.log("acting");
    return true;
};
