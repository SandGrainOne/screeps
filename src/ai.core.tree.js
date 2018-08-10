'use strict';

class Tree {
    constructor () {
        this._id = Empire.createId();

        this._root = null;
    }

    get root () {
        return this._root;
    }

    set root (value) {
        this._root = value;
    }

    run () {
        return this._root.run();
    }
}

module.exports = Tree;
