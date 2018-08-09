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
     * Gets the amount of resources callculated to be carried by the creep at the end of the work cycle.
     */
    get CargoAmount() {
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

    /**
     * This function is a wrapper for creep.build().
     * It helps keep track of the amount of cargo currently in the creep.
     * 
     * @param {ConstructionSite} target - The target construction site.
     */
    build(target) {
        let res = this.creep.build(target);
        if (res === OK) {
            this._energy = this._energy - (this._strength * 5);
        }
        return res;
    }

    /**
     * This function is a wrapper for creep.repair().
     * It helps keep track of the amount of cargo currently in the creep.
     * 
     * @param {Structure} target - The target structure to repair.
     */
    repair(target) {
        let res = this.creep.repair(target);
        if (res === OK) {
            this._energy = this._energy - this._strength;
        }
        return res;
    }

    /**
     * This function is a wrapper for creep.upgradeController().
     * It helps keep track of the amount of cargo currently in the creep.
     * 
     * @param {StructureController} target - The controller to upgrade.
     */
    upgrade(target) {
        let res = this.creep.upgradeController(target);
        if (res === OK) {
            this._energy = this._energy - this._strength;
        }
        return res;
    }

    /**
     * This function is a wrapper for creep.harvest().
     * It helps keep track of the amount of cargo currently in the creep.
     * 
     * @param {Source|Mineral} target - The mineral node to harvest from.
     */
    harvest(target) {
        let res = this.creep.harvest(target);
        if (res === OK) {
            if (target instanceof Source) {
                this._energy = this._energy + (this._strength * 2);
            }        
            if (target instanceof Mineral) {
                this._carry = this._carry + (this._strength);
            }
        }
        return res;
    }

    /**
     * This function is a wrapper for creep.drop().
     * It helps keep track of the amount of cargo currently in the creep.
     * 
     * @param {string} resourceType - One of the RESOURCE_* constants indicating what resource to drop.
     */
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

    /**
     * This function is a wrapper for creep.pickup().
     * It helps keep track of the amount of cargo currently in the creep.
     * 
     * @param {Resource} target - The resource drop to pick up from the ground.
     */
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

    /**
     * This function is a wrapper for creep.transfer().
     * It helps keep track of the amount of cargo currently in the creep.
     * 
     * @param {Structure} target - The structure to transfer the resource to.
     * @param {string} resourceType - One of the RESOURCE_* constants indicating what resource to drop.
     */
    transfer(target, resourceType) {
        let targetSpace = 0;
        if (target.storeCapacity) {
            // Containers, Storage, Terminal, etc
            targetSpace = target.storeCapacity - _.sum(target.store);
        }
        else if (target.energyCapacity) {
            // Links, Labs, Towers, etc
            targetSpace = target.energyCapacity - target.energy;
        }

        let carriedAmount = this.creep.carry[resourceType];
        let amountTransfered = Math.min(targetSpace, carriedAmount);

        if (amountTransfered <= 0) {
            return ERR_NOT_ENOUGH_RESOURCES;
        }

        let res = this.creep.transfer(target, resourceType, amountTransfered);
        if (res === OK) {
            if (resourceType === RESOURCE_ENERGY) {
                this._energy = this._energy - amountTransfered;
            }
            else {
                this._carry = this._carry - amountTransfered;
            }
        }
        return res;
    }

    /**
     * This function is a wrapper for creep.withdraw().
     * It helps keep track of the amount of cargo currently in the creep.
     * 
     * @param {Structure} target - The structure to withdraw resources from.
     * @param {string} resourceType - One of the RESOURCE_* constants indicating what resource to drop.
     */
    withdraw(target, resourceType) {
        let amountStored = 0;
        if (target.store) {
            // Containers, Storage, Terminal, etc
            amountStored = target.store[resourceType];
        }
        else if (target.energy) {
            // Links, Labs, Towers, etc
            amountStored = target.energy;
        }

        let restCapacity = this.Capacity - this.CargoAmount;
        let amountTransfered = Math.min(amountStored, restCapacity);

        if (amountTransfered <= 0) {
            return ERR_NOT_ENOUGH_RESOURCES;
        }

        let res = this.creep.withdraw(target, resourceType, amountTransfered);
        if (res === OK) {
            if (resourceType === RESOURCE_ENERGY) {
                this._energy = this._energy + amountTransfered;
            }
            else {
                this._carry = this._carry + amountTransfered;
            }
        }
        return res;
    }
}

module.exports = CreepWorker;
