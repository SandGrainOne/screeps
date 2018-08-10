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

        if (!this.Room.terminal || !this.Room.Labs.compoundOne || !this.Room.Labs.compoundTwo || this.Room.Labs.producers.length <= 0) {
            return false;
        }
        
        let reaction = {};

        if (this.Room.name === "E75N87") {
            reaction = { compoundOne: RESOURCE_CATALYST, compoundTwo: RESOURCE_UTRIUM_ACID };
        }

        if (this.Room.name === "E77N88") {
            reaction = { compoundOne: RESOURCE_OXYGEN, compoundTwo: RESOURCE_HYDROGEN };
        }

        if (this.Room.name === "E77N85") {
            reaction = { compoundOne: RESOURCE_ZYNTHIUM_KEANITE, compoundTwo: RESOURCE_UTRIUM_LEMERGITE };
        }

        if (this.Room.name === "E78N85") {
            reaction = { compoundOne: RESOURCE_GHODIUM_ACID, compoundTwo: RESOURCE_CATALYST };
        }

        if (this.Room.name === "E79N85") {
            reaction = { compoundOne: RESOURCE_UTRIUM_LEMERGITE, compoundTwo: RESOURCE_ZYNTHIUM_KEANITE };
        }

        if (this.Room.name === "E79N86") {
            reaction = { compoundOne: RESOURCE_UTRIUM_LEMERGITE, compoundTwo: RESOURCE_ZYNTHIUM_KEANITE };
        }

        let emptyCreep = false;

        if (this.load > 0) {
            for (let resourceType in this.creep.carry) {
                if (this.creep.carry[resourceType] > 0) {
                    if (resourceType !== reaction.compoundOne && resourceType !== reaction.compoundTwo) {
                        emptyCreep = true;
                        break;
                    }
                }
            }
        }

        if (this.load >= this.capacity) {
            if (this.Room.Labs.compoundOne.mineralAmount > 0 && this.Room.Labs.compoundTwo.mineralAmount > 0) {
                emptyCreep = true;
            }
        }

        if (Object.keys(this.creep.carry).length > 2 || (this.load > 0 && this.load < this.capacity)) {
            emptyCreep = true;
        }

        if (emptyCreep) {
            if (this.creep.pos.isNearTo(this.Room.terminal)) {
                for (let resourceType in this.creep.carry) {
                    if (this.transfer(this.Room.terminal, resourceType) === OK) {
                        break;
                    }
                }
            }
            else {
                this.moveTo(this.Room.terminal);
            }
            return true;
        }

        for (let compound in reaction) {
            if (this.Room.Labs[compound].mineralType && this.Room.Labs[compound].mineralType !== reaction[compound]) {
                if (this.creep.pos.isNearTo(this.Room.Labs[compound])) {
                    this.withdraw(this.Room.Labs[compound], this.Room.Labs[compound].mineralType);
                }
                else {
                    this.moveTo(this.Room.Labs[compound]);
                }
                return true;
            }
        }

        for (let compound in reaction) {
            if (this.creep.carry[reaction[compound]] && this.creep.carry[reaction[compound]] >= this.capacity) {
                if (this.Room.Labs[compound].mineralAmount <= 0) {
                    if (this.creep.pos.isNearTo(this.Room.Labs[compound])) {
                        this.transfer(this.Room.Labs[compound], reaction[compound]);
                    }
                    else {
                        this.moveTo(this.Room.Labs[compound]);
                    }
                    return true;
                }
            }
        }

        if (this.load <= 0) {
            for (let compound in reaction) {
                if (this.Room.Labs[compound].mineralAmount <= 0) {
                    if (this.creep.pos.isNearTo(this.Room.terminal)) {
                        this.withdraw(this.Room.terminal, reaction[compound]);
                    }
                    else {
                        this.moveTo(this.Room.terminal);
                    }
                    return true;
                }
            }
        }

        if (this.load < this.capacity) {
            for (let producer of this.Room.Labs.producers) {
                if (producer.mineralType && producer.mineralType !== REACTIONS[reaction.compoundOne][reaction.compoundTwo]){                    
                    if (this.creep.pos.isNearTo(producer)) {
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
            this.Room.Labs.producers.sort(function(a, b) { return b.mineralAmount - a.mineralAmount });
            if (this.Room.Labs.producers[0].mineralAmount > 0) {
                if (this.creep.pos.isNearTo(this.Room.Labs.producers[0])) {
                    this.withdraw(this.Room.Labs.producers[0], this.Room.Labs.producers[0].mineralType);
                }
                else {
                    this.moveTo(this.Room.Labs.producers[0]);
                }
            }
            return true;
        }

        if (this.load >= this.capacity) { 
            for (let resourceType in this.creep.carry) {
                if (this.creep.carry[resourceType] > 0) {
                    // Creep holds wrong type of resource. Get rid of it.
                    this.moveTo(this.Room.terminal);
                    
                    if (this.creep.pos.isNearTo(this.Room.terminal)) {
                        this.transfer(this.Room.terminal, resourceType);
                        break;
                    }
                }
            }
            return true;
        }
    }
}

module.exports = CreepChemist;
