'use strict';

let c = require('./ai.core.constants');
let utils = require('./ai.core.utils');

class Node {
    constructor () {
        this._id = utils.createId();
    }

    run () {
        return c.SUCCESS;
    }
}

module.exports = Node;
