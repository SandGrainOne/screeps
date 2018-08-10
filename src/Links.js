'use strict';

let C = require('./constants');

/**
 * This class is meant to combine all links in a room into a single logical unit
 * that teleports energy around in the room. On top of that it provides easy
 * access to links of different types for creeps to use.
 */
class Links {
    /**
     * Initializes a new instance of the Links class.
     * 
     * @param {object} memory - The part of room memory assigned to the linking system.
     */
    constructor (memory) {
        this._mem = memory;

        // Tick cache
        this._cache = {};
    }

    /**
     * Gets the room link near the room storage if such a link exist. Otherwise null.
     */
    get storage () {
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

    /**
     * Gets the room link near the room controller if such a link exist. Otherwise null.
     */
    get controller () {
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
    get inputs () {
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

    /**
     * This operation will reset the memory and organize the new set of links.
     * 
     * @param {RoomReal} room - The room where this linking system is located.
     * @param {Link[]} links - All the links in the room.
     */
    populate (room, links) {
        if (links.length < 2) {
            this._mem.canRun = false;
            return;
        }

        this._mem.controller = null;
        this._mem.storage = null;
        this._mem.inputs = [];

        for (let link of links) {
            let rangeToStorage = 5;
            if (room.storage) {
                rangeToStorage = link.pos.getRangeTo(room.storage);
            }

            let rangeToController = 5;
            if (room.controller) {
                rangeToController = link.pos.getRangeTo(room.controller);
            }

            if (Math.min(rangeToStorage, rangeToController) > 3) {
                this._mem.inputs.push(link.id);
            }
            else if (rangeToController < rangeToStorage) {
                this._mem.controller = link.id;
            }
            else {
                this._mem.storage = link.id;
            }
        }

        this._mem.canRun = true;
    }

    /**
     * Run linking logic so that energy is teleported to the storage and controller.
     */
    run () {
        if (!this._mem.canRun) {
            return;
        }

        // The linking system should not attempt to perform more than one transfer per tick.
        let transfered = false;

        for (let inputLink of this.inputs) {
            if (inputLink.cooldown > 0) {
                continue;
            }

            if (this.controller) {
                if (this._transfer(inputLink, this.controller) === OK) {
                    transfered = true;
                    break;
                }
            }

            if (this.storage) {
                if (this._transfer(inputLink, this.storage) === OK) {
                    transfered = true;
                    break;
                }
            }
        }

        if (!transfered && this.controller && this.storage && this.storage.cooldown === 0) {
            this._transfer(this.storage, this.controller);
        }
    }

    /**
     * Transfer energy between two links. Must be a minimum of 200 energy.
     * 
     * @param {Link} sender - The link that should send some energy.
     * @param {Link} target - The link that should recieve the energy.
     */
    _transfer (sender, target) {
        let amount = Math.min(sender.energy, target.energyCapacity - target.energy);
        if (amount >= C.LINK_MINIMUM_TRANSFER) {
            return sender.transferEnergy(target, amount);
        }
        return ERR_NOT_ENOUGH_RESOURCES;
    }
}

module.exports = Links;
