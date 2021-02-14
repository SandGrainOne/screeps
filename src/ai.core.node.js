'use strict';

const c = require('./ai.core.constants');
const utils = require('./ai.core.utils');

class Node {
    constructor () {
        this._id = utils.createId();
    }

    run () {
        return c.SUCCESS;
    }
}

module.exports = Node;
