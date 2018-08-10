'use strict';

let CreepWorker = require('./Creep.Worker');

/**
 * Wrapper class for creeps with logic for a chemist.
 * Primary purpose of these creeps are to handle minerals
 */
class CreepChemist extends CreepWorker {
    /**
     * Perform chemist related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work () {
        if (!this.atWork) {
            this.moveToRoom(this._mem.rooms.work);
            return true;
        }

        if (!this.room.terminal || !this.room.labs.compoundOne || !this.room.labs.compoundTwo || this.room.labs.producers.length <= 0) {
            return false;
        }

        let reaction = {};

        if (this.room.name === 'E71N87') {
            reaction = { compoundOne: RESOURCE_CATALYST, compoundTwo: RESOURCE_GHODIUM_ACID };
        }

        if (this.room.name === 'E73N87') {
            reaction = { compoundOne: RESOURCE_CATALYST, compoundTwo: RESOURCE_GHODIUM_ACID };
        }

        if (this.room.name === 'E75N87') {
            reaction = { compoundOne: RESOURCE_CATALYST, compoundTwo: RESOURCE_GHODIUM_ALKALIDE };
        }

        if (this.room.name === 'E75N89') {
            reaction = { compoundOne: RESOURCE_HYDROXIDE, compoundTwo: RESOURCE_GHODIUM_OXIDE };
        }

        if (this.room.name === 'E77N88') {
            reaction = { compoundOne: RESOURCE_HYDROGEN, compoundTwo: RESOURCE_OXYGEN };
        }

        if (this.room.name === 'E77N85') {
            reaction = { compoundOne: RESOURCE_KEANIUM, compoundTwo: RESOURCE_ZYNTHIUM };
        }

        if (this.room.name === 'E78N85') {
            reaction = { compoundOne: RESOURCE_GHODIUM, compoundTwo: RESOURCE_HYDROGEN };
        }

        if (this.room.name === 'E78N88') {
            reaction = { compoundOne: RESOURCE_GHODIUM_OXIDE, compoundTwo: RESOURCE_HYDROXIDE };
        }

        if (this.room.name === 'E79N85') {
            reaction = { compoundOne: RESOURCE_LEMERGIUM, compoundTwo: RESOURCE_UTRIUM };
        }

        if (this.room.name === 'E79N86') {
            reaction = { compoundOne: RESOURCE_UTRIUM, compoundTwo: RESOURCE_LEMERGIUM };
        }

        let emptyCreep = false;

        if (this.load > 0) {
            for (let resourceType in this.carry) {
                if (this.carry[resourceType] > 0) {
                    if (resourceType !== reaction.compoundOne && resourceType !== reaction.compoundTwo) {
                        emptyCreep = true;
                        break;
                    }
                }
            }
        }

        if (this.load >= this.capacity) {
            if (this.room.labs.compoundOne.mineralAmount > 0 && this.room.labs.compoundTwo.mineralAmount > 0) {
                emptyCreep = true;
            }
        }

        if (emptyCreep) {
            if (this.pos.isNearTo(this.room.terminal)) {
                for (let resourceType in this.carry) {
                    if (this.transfer(this.room.terminal, resourceType) === OK) {
                        break;
                    }
                }
            }
            else {
                this.moveTo(this.room.terminal);
            }
            return true;
        }

        for (let compound in reaction) {
            if (this.room.labs[compound].mineralType && this.room.labs[compound].mineralType !== reaction[compound]) {
                if (this.pos.isNearTo(this.room.labs[compound])) {
                    this.withdraw(this.room.labs[compound], this.room.labs[compound].mineralType);
                }
                else {
                    this.moveTo(this.room.labs[compound]);
                }
                return true;
            }
        }

        for (let compound in reaction) {
            if (this.carry[reaction[compound]] && this.carry[reaction[compound]] >= this.capacity) {
                if (this.room.labs[compound].mineralAmount <= 0) {
                    if (this.pos.isNearTo(this.room.labs[compound])) {
                        this.transfer(this.room.labs[compound], reaction[compound]);
                    }
                    else {
                        this.moveTo(this.room.labs[compound]);
                    }
                    return true;
                }
            }
        }

        if (this.load <= 0) {
            if (this.room.terminal.store[reaction.compoundOne] && this.room.terminal.store[reaction.compoundTwo]) {
                for (let compound in reaction) {
                    if (this.room.labs[compound].mineralAmount <= 0) {
                        if (this.pos.isNearTo(this.room.terminal)) {
                            this.withdraw(this.room.terminal, reaction[compound]);
                        }
                        else {
                            this.moveTo(this.room.terminal);
                        }
                        return true;
                    }
                }
            }
        }

        if (this.load < this.capacity) {
            for (let producer of this.room.labs.producers) {
                if (producer.mineralType && producer.mineralType !== REACTIONS[reaction.compoundOne][reaction.compoundTwo]) {
                    if (this.pos.isNearTo(producer)) {
                        this.withdraw(producer, producer.mineralType);
                    }
                    else {
                        this.moveTo(producer);
                    }
                    return true;
                }
            }
        }

        if (this.load < this.capacity) {
            this.room.labs.producers.sort((a, b) => b.mineralAmount - a.mineralAmount);
            if (this.room.labs.producers[0].mineralAmount > 0) {
                if (this.pos.isNearTo(this.room.labs.producers[0])) {
                    this.withdraw(this.room.labs.producers[0], this.room.labs.producers[0].mineralType);
                }
                else {
                    this.moveTo(this.room.labs.producers[0]);
                }
            }
            if (Object.keys(this.room.storage.store).length > 1) {
                if (_.sum(this.room.terminal.store) < this.room.terminal.storeCapacity * 0.9) {
                    if (this.pos.isNearTo(this.room.storage)) {
                        for (let resourceType in this.room.storage.store) {
                            // Taking energy from the storage is handled by refuelers.
                            if (resourceType === RESOURCE_ENERGY) {
                                continue;
                            }

                            // Moving all resources except energy to the terminal.
                            if (this.room.storage.store[resourceType] > 0) {
                                if (this.withdraw(this.room.storage, resourceType) === OK) {
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        this.moveTo(this.room.storage);
                    }
                }
            }
            return true;
        }

        if (this.load >= this.capacity) {
            for (let resourceType in this.carry) {
                if (this.carry[resourceType] > 0) {
                    // Creep holds wrong type of resource. Get rid of it.
                    this.moveTo(this.room.terminal);

                    if (this.pos.isNearTo(this.room.terminal)) {
                        this.transfer(this.room.terminal, resourceType);
                        break;
                    }
                }
            }
            return true;
        }
    }
}

module.exports = CreepChemist;
