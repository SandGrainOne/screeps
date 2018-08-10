'use strict';

let C = require('constants');

let CreepWorker = require('Creep.Worker');

/**
 * Wrapper class for creeps with logic for a chemist.
 * Primary purpose of these creeps are to handle minerals
 */
class CreepChemist extends CreepWorker {   
    /**
     * Initializes a new instance of the CreepChemist class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep) {
        super(creep);
    }
    
    /**
     * Perform broker related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        if (!this.atWork) {
            this.moveToRoom(this.WorkRoom.name);
            return true;
        }

        if (!this.room.terminal || !this.room.Labs.compoundOne || !this.room.Labs.compoundTwo || this.room.Labs.producers.length <= 0) {
            return false;
        }
        
        let reaction = {};

        if (this.room.name === "E75N87") {
            reaction = { compoundOne: RESOURCE_CATALYST, compoundTwo: RESOURCE_GHODIUM_ALKALIDE };
        }

        if (this.room.name === "E75N89") {
            reaction = { compoundOne: RESOURCE_LEMERGIUM, compoundTwo: RESOURCE_UTRIUM };
        }

        if (this.room.name === "E77N88") {
            reaction = { compoundOne: RESOURCE_HYDROGEN, compoundTwo: RESOURCE_OXYGEN };
        }

        if (this.room.name === "E77N85") {
            reaction = { compoundOne: RESOURCE_GHODIUM, compoundTwo: RESOURCE_HYDROGEN };
        }

        if (this.room.name === "E78N85") {
            reaction = { compoundOne: RESOURCE_LEMERGIUM_OXIDE, compoundTwo: RESOURCE_HYDROXIDE };
        }

        if (this.room.name === "E79N85") {
            reaction = { compoundOne: RESOURCE_GHODIUM_ACID, compoundTwo: RESOURCE_CATALYST };
        }

        if (this.room.name === "E79N86") {
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
            if (this.room.Labs.compoundOne.mineralAmount > 0 && this.room.Labs.compoundTwo.mineralAmount > 0) {
                emptyCreep = true;
            }
        }

        if (Object.keys(this.carry).length > 2 || (this.load > 0 && this.load < this.capacity)) {
            emptyCreep = true;
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
            if (this.room.Labs[compound].mineralType && this.room.Labs[compound].mineralType !== reaction[compound]) {
                if (this.pos.isNearTo(this.room.Labs[compound])) {
                    this.withdraw(this.room.Labs[compound], this.room.Labs[compound].mineralType);
                }
                else {
                    this.moveTo(this.room.Labs[compound]);
                }
                return true;
            }
        }

        for (let compound in reaction) {
            if (this.carry[reaction[compound]] && this.carry[reaction[compound]] >= this.capacity) {
                if (this.room.Labs[compound].mineralAmount <= 0) {
                    if (this.pos.isNearTo(this.room.Labs[compound])) {
                        this.transfer(this.room.Labs[compound], reaction[compound]);
                    }
                    else {
                        this.moveTo(this.room.Labs[compound]);
                    }
                    return true;
                }
            }
        }

        if (this.load <= 0) {
            for (let compound in reaction) {
                if (this.room.Labs[compound].mineralAmount <= 0) {
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

        if (this.load < this.capacity) {
            for (let producer of this.room.Labs.producers) {
                if (producer.mineralType && producer.mineralType !== REACTIONS[reaction.compoundOne][reaction.compoundTwo]){                    
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
            this.room.Labs.producers.sort(function(a, b) { return b.mineralAmount - a.mineralAmount });
            if (this.room.Labs.producers[0].mineralAmount > 0) {
                if (this.pos.isNearTo(this.room.Labs.producers[0])) {
                    this.withdraw(this.room.Labs.producers[0], this.room.Labs.producers[0].mineralType);
                }
                else {
                    this.moveTo(this.room.Labs.producers[0]);
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
