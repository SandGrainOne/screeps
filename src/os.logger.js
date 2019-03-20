'use strict';

os.log = {};

os.log.info = function (message) {
    log(message, '999999'); // gray
};

os.log.warning = function (message) {
    log(message, 'e6de99'); // yellow
};

os.log.error = function (message) {
    log(message, 'f03a47'); // red
};

function log (message, color) {
    let output = `<font style="color:#${color}">${Game.time} - ${message}</font>`;
    console.log(output);
}
