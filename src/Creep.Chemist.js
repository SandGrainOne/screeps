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
        if (!this.AtWork) {
            this.moveToRoom(this.WorkRoom.name);
            return true;
        }

        if (!this.Room.storage || !this.Room.Labs.compoundOne || !this.Room.Labs.compoundTwo || this.Room.Labs.producers.length <= 0) {
            return false;
        }
        
        let reaction = {};

        if (this.Room.name === "E77N88") {
            reaction = { compoundOne: RESOURCE_ZYNTHIUM, compoundTwo: RESOURCE_KEANIUM };
        }

        if (this.Room.name === "E77N85") {
            reaction = { compoundOne: RESOURCE_HYDROXIDE, compoundTwo: RESOURCE_KEANIUM_HYDRIDE };
        }

        if (this.Room.name === "E78N85") {
            reaction = { compoundOne: RESOURCE_HYDROGEN, compoundTwo: RESOURCE_OXYGEN };
        }

        if (this.Room.name === "E79N85") {
            reaction = { compoundOne: RESOURCE_OXYGEN, compoundTwo: RESOURCE_LEMERGIUM };
        }

        if (this.Room.name === "E79N86") {
            reaction = { compoundOne: RESOURCE_UTRIUM, compoundTwo: RESOURCE_HYDROGEN };
        }

        let emptyCreep = false;

        if (this.NextCarry > 0) {
            for (let resourceType in this.creep.carry) {
                if (this.creep.carry[resourceType] > 0) {
                    if (resourceType !== reaction.compoundOne && resourceType !== reaction.compoundTwo) {
                        emptyCreep = true;
                        break;
                    }
                }
            }
        }

        if (this.NextCarry >= this.Capacity) {
            if (this.Room.Labs.compoundOne.mineralAmount > 0 && this.Room.Labs.compoundTwo.mineralAmount > 0) {
                emptyCreep = true;
            }
        }

        if (Object.keys(this.creep.carry).length > 2 || (this.NextCarry > 0 && this.NextCarry < this.Capacity)) {
            emptyCreep = true;
        }

        if (emptyCreep) {
            if (this.creep.pos.isNearTo(this.Room.storage)) {
                for (let resourceType in this.creep.carry) {
                    if (this.transfer(this.Room.storage, resourceType) === OK) {
                        break;
                    }
                }
            }
            else {
                this.moveTo(this.Room.storage);
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
            if (this.creep.carry[reaction[compound]] && this.creep.carry[reaction[compound]] >= this.Capacity) {
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

        if (this.NextCarry <= 0) {
            for (let compound in reaction) {
                if (this.Room.Labs[compound].mineralAmount <= 0) {
                    if (this.creep.pos.isNearTo(this.Room.storage)) {
                        this.withdraw(this.Room.storage, reaction[compound]);
                    }
                    else {
                        this.moveTo(this.Room.storage);
                    }
                    return true;
                }
            }
        }

        if (this.NextCarry < this.Capacity) {
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

        if (this.NextCarry >= this.Capacity) { 
            for (let resourceType in this.creep.carry) {
                if (this.creep.carry[resourceType] > 0) {
                    // Creep holds wrong type of resource. Get rid of it.
                    this.moveTo(this.Room.storage);
                    
                    if (this.creep.pos.isNearTo(this.Room.storage)) {
                        this.transfer(this.Room.storage, resourceType);
                        break;
                    }
                }
            }
            return true;
        }
    }
}

module.exports = CreepChemist;
