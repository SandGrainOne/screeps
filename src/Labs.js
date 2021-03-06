'use strict';

/**
 * This class is meant to combine all labs in a room into a single logical unit.
 * The unit will be able to process minerals and provide boost to creeps. It also
 * adds easy to access properties for labs with different roles so that creeps can
 * access them.
 */
class Labs {
    /**
     * Initializes a new instance of the Labs class.
     * 
     * @param {object} memory - The part of room memory assigned to the laboratory unit.
     */
    constructor (memory) {
        this._mem = memory;

        // Tick cache
        this._cache = {};
    }

    get canRun () {
        return this._mem.canRun !== undefined && this._mem.canRun;
    }

    get all () {
        if (this._cache.all !== undefined) {
            return this._cache.all;
        }
        this._cache.all = [];
        if (this.compoundOne !== null) {
            this._cache.all.push(this.compoundOne);
        }
        if (this.compoundTwo !== null) {
            this._cache.all.push(this.compoundTwo);
        }
        if (this.producers.length > 0) {
            this._cache.all = this._cache.all.concat(this.producers);
        }
        return this._cache.all;
    }

    /**
     * Gets the lab assigned to be the first reaction source.
     */
    get compoundOne () {
        if (this._cache.sourceOne !== undefined) {
            return this._cache.sourceOne;
        }

        this._cache.sourceOne = null;
        if (this._mem.sourceOne) {
            const lab = Game.getObjectById(this._mem.sourceOne);
            if (lab) {
                this._cache.sourceOne = lab;
            }
        }

        return this._cache.sourceOne;
    }

    /**
     * Gets the lab assigned to be the first reaction source.
     */
    get compoundTwo () {
        if (this._cache.sourceTwo !== undefined) {
            return this._cache.sourceTwo;
        }

        this._cache.sourceTwo = null;
        if (this._mem.sourceTwo) {
            const lab = Game.getObjectById(this._mem.sourceTwo);
            if (lab) {
                this._cache.sourceTwo = lab;
            }
        }

        return this._cache.sourceTwo;
    }

    /**
     * Gets an array with all labs that are available to perform a reaction.
     */
    get producers () {
        if (this._cache.producers !== undefined) {
            return this._cache.producers;
        }

        this._cache.producers = [];
        if (this._mem.producers && this._mem.producers.length > 0) {
            for (const id of this._mem.producers) {
                const lab = Game.getObjectById(id);
                if (lab) {
                    this._cache.producers.push(lab);
                }
            }
        }

        return this._cache.producers;
    }

    /**
     * This operation will reset the memory and organize the new set of labs.
     * 
     * @param {RoomReal} room - The room where this laboratory unit is located.
     * @param {Lab[]} labs - All the labs in the room.
     */
    populate (room, labs) {
        if (labs.length < 3) {
            this._mem.canRun = false;
            return;
        }

        this._mem.sourceOne = null;
        this._mem.sourceTwo = null;
        this._mem.producers = [];

        labs.sort((a, b) => (a.pos.x + a.pos.y * 10) - (b.pos.x + b.pos.y * 10));

        const s1 = Math.floor((labs.length - 1) / 2) - 1;
        const s2 = s1 + Math.ceil((s1 + 2) / 2);

        for (let i = 0; i < labs.length; i++) {
            if (i === s1) {
                this._mem.sourceOne = labs[i].id;
            }
            else if (i === s2) {
                this._mem.sourceTwo = labs[i].id;
            }
            else {
                this._mem.producers.push(labs[i].id);
            }
        }

        this._mem.canRun = true;
    }

    /**
     * Run laboratory logic by having all producers run their reaction if possible.
     */
    run () {
        if (!this._mem.canRun) {
            return;
        }

        if (!this.compoundOne || !this.compoundTwo || this.compoundOne.mineralAmount <= 0 || this.compoundTwo.mineralAmount <= 0) {
            return;
        }

        for (const producer of this.producers) {
            if (producer.cooldown === 0) {
                producer.runReaction(this.compoundOne, this.compoundTwo);
            }
        }
    }
}

module.exports = Labs;
