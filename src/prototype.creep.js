'use strict';

/**
 * This module holds all changes to the creep prototype provided by the game.
 */

 /**
  * Example of instance function
  */
Creep.prototype.act = function() {
    this.say("acting");
    return true;
};

/**
 * Example of static function
 */
Creep.talk = function(creep) {
    creep.say("acting");
    return true;
};
