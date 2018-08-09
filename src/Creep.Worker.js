'use strict';

let C = require('constants');

let CreepBase = require('Creep.Base');

/**
 * Wrapper class for creeps with worker related logic.
 */
class CreepWorker extends CreepBase {
    
    /**
     * Initializes a new instance of the CreepWorker class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep) {
        super(creep);

        this._strength = this.creep.getActiveBodyparts(WORK);
        this._capacity = this.creep.getActiveBodyparts(CARRY) * 50;

        this._startEnergy = this.creep.carry.energy;
        this._startCarry =_.sum(this.creep.carry);

        this._carry = this._startCarry - this._startEnergy;
        this._energy = this._startEnergy;
    }

    /**
     * Gets the carry capacity of the creep.
     */
    get Capacity() {
        return this._capacity;
    }

    /**
     * Gets the work strength of the creep.
     */
    get Strength() {
        return this._strength;
    }

    /**
     * Gets the amount of energy carried by the creep at the start of its work cycle.
     */
    get StartEnergy() {
        return this._startEnergy;
    }

    /**
     * Gets the amount of resources carried by the creep at the start of its work cycle.
     */
    get StartCarry() {
        return this._startCarry;
    }

    /**
     * Gets the amount of energy callculated to be held by the creep at the end of the work cycle.
     */
    get EndEnergy() {
        return this._energy;
    }

    /**
     * Gets the amount of resources callculated to be carried by the creep at the end of the work cycle.
     */
    get EndCarry() {
        return this._carry + this._energy;
    }

    /**
     * Gets a value indicating whether the creep is working.
     */
    get IsWorking() {
        return !!this.mem.isworking;
    }

    /**
     * Sets a value indicating whether the creep is working.
     */
    set IsWorking(value) {
        this.mem.isworking = !!value;
    }

    /**
     * Perform a retreat if there is an enemy creep in the room or if it is hurt.
     * 
     * @returns {Boolean} true if the retreat was required and the creep is on the move
     */
    retreat() {
        if (!this.AtHome) {
            if (this.Room.State !== C.ROOM_STATE_NORMAL || this.creep.hits < this.creep.hitsMax) {
                this.moveToRoom(this.HomeRoom);
                return true;
            }
        }
        return false;
    }

    build(target) {
        let res = this.creep.build(target);
        if (res === OK) {
            this._energy = this._energy - (this._strength * 5);
        }
        return res;
    }

    repair(target) {
        let res = this.creep.repair(target);
        if (res === OK) {
            this._energy = this._energy - this._strength;
        }
        return res;
    }

    upgrade(target) {
        let res = this.creep.upgradeController(target);
        if (res === OK) {
            this._energy = this._energy - this._strength;
        }
        return res;
    }

    harvest(target) {
        let res = this.creep.harvest(target);
        if (res === OK) {
            if (target instanceof Source) {
                this._energy = this._energy + (this._strength * 2);
            }        
            if (target instanceof Mineral) {
                this._carry = this._carry + (this._strength * 2);
            }
        }
        return res;
    }

    drop(resourceType) {
        let res = this.creep.drop(resourceType);
        if (res === OK) {
            let carriedAmount = this.creep.carry[resourceType];
            if (resourceType === RESOURCE_ENERGY) {
                this._energy = this._energy - carriedAmount;
            }
            else {
                this._carry = this._carry - carriedAmount;
            }
        }
        return res;
    }

    pickup(target) {
        let res = this.creep.pickup(target);
        if (res === OK) {
            let creepSpace = this.Capacity - this.EndCarry;
            if (target.resourceType === RESOURCE_ENERGY) {
                this._energy = this._energy + Math.min(target.amount, creepSpace);
            }
            else {
                this._carry = this._carry + Math.min(target.amount, creepSpace);
            }
        }
        return res;
    }

    transfer(target, resourceType) {
        let res = this.creep.transfer(target, resourceType);
        if (res === OK) {
            let targetSpace = 0;
            if (target.storeCapacity) {
                targetSpace = target.storeCapacity - _.sum(target.store);
            }
            else if (target.energyCapacity) {
                targetSpace = target.energyCapacity - target.energy;
            }

            let carriedAmount = this.creep.carry[resourceType];
            let transfered = Math.min(targetSpace, carriedAmount);

            if (resourceType === RESOURCE_ENERGY) {
                this._energy = this._energy - transfered;
            }
            else {
                this._carry = this._carry - transfered;
            }
        }
        return res;
    }

    withdraw(target, resourceType) {
        let res = this.creep.withdraw(target, resourceType);
        if (res === OK) {
            let storedAmount = 0;
            if (target.store) {
                storedAmount = target.store[resourceType];
            }
            else if (target.energy) {
                storedAmount = target.energy;
            }

            let creepSpace = this.Capacity - this.EndCarry;
            let transfered = Math.min(storedAmount, creepSpace);

            if (resourceType === RESOURCE_ENERGY) {
                this._energy = this._energy + transfered;
            }
            else {
                this._carry = this._carry + transfered;
            }
        }
        return res;
    }

    /**
     * Logic that tries to find a source of stored energy in current room and withdraw as much as possible.
     */
    findStoredEnergy() {
        let roomStorage = this.Room.Storage;

        if (roomStorage && roomStorage.store[RESOURCE_ENERGY] > 0) {
            if (this.creep.withdraw(roomStorage, RESOURCE_ENERGY) !== OK) {
                this.creep.moveTo(roomStorage);
            }
            return true;
        }
        
        let container = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
            filter: function (structure) { 
                return structure.structureType === STRUCTURE_CONTAINER && (structure.store.energy > 0); 
            } 
        });

        if (container !== null) {
            if (this.creep.withdraw(container, RESOURCE_ENERGY) !== OK) {
                this.creep.moveTo(container);
            }
            return true;
        }
        
        return false;
    }
}

module.exports = CreepWorker;
