'use strict';

os.logger = {};

/**
 * Write an information message to the console.
 */
os.logger.info = function (message) {
    _log(message, '999999'); // gray
};

/**
 * Write a warning message to the console.
 */
os.logger.warning = function (message) {
    _log(message, 'e6de99'); // yellow
};

/**
 * Write an error message to the console.
 */
os.logger.error = function (message) {
    _log(message, 'f03a47'); // red
};

/**
 * Write a message to the console using the given color.
 * 
 * @param {string} message - The message to write
 * @param {string} color - The hex code for a color
 */
function _log (message, color) {
    const output = `<font style="color:#${color}">${Game.time} - ${message}</font>`;
    console.log(output);
};
