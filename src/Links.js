'use strict';

/**
 * This class is meant to combine all links in a room into a single logical unit that
 * teleports energy around in the room. On top of that it provides easy access to links
 * with different roles.
 */
class Links {
    /**
     * Initializes a new instance of the Links class.
     */
    constructor(room, memory) {
        this._room = room;
        this._mem = memory;

        // Tick cache
        this._cache = {};
    }

    get storage() {
        if (this._cache.storage !== undefined) {
            return this._cache.storage;
        }

        this._cache.storage = null;
        if (this._mem.storage) {
            let link = Game.getObjectById(this._mem.storage);
            if (link) {
                this._cache.storage = link;
            }
        }

        return this._cache.storage;
    }

    get controller() {
        if (this._cache.controller !== undefined) {
            return this._cache.controller;
        }

        this._cache.controller = null;
        if (this._mem.controller) {
            let link = Game.getObjectById(this._mem.controller);
            if (link) {
                this._cache.controller = link;
            }
        }

        return this._cache.controller;
    }

    /**
     * Gets an array with all input links in the room. Empty if there are no such links.
     */
    get inputs() {
        if (this._cache.inputs !== undefined) {
            return this._cache.inputs;
        }

        this._cache.inputs = [];
        if (this._mem.inputs && this._mem.inputs.length > 0) {
            for (let id of this._mem.inputs) {
                let link = Game.getObjectById(id);
                if (link) {
                    this._cache.inputs.push(link);
                }
            }
        }

        return this._cache.inputs;
    }

    run() {
        console.log(JSON.stringify(this.inputs));
        return;
    }
}

module.exports = Links;