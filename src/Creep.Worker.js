'use strict';

const C = require('./constants');

const CreepBase = require('./Creep.Base');

/**
 * Wrapper class for creeps with worker related logic.
 */
class CreepWorker extends CreepBase {
    /**
     * Initializes a new instance of the CreepWorker class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor (creep) {
        super(creep);

        this._energy = this._creep.store[RESOURCE_ENERGY];
        this._minerals = this._creep.store.getUsedCapacity() - this._energy;

        this._performedWork = {};
    }

    /**
     * Gets an object with the creep's cargo contents.
     */
    get carry () {
        return this._creep.carry;
    }

    /**
     * Gets an object with the creep's cargo contents.
     */
    get store () {
        return this._creep.store;
    }

    /**
     * Gets the carry capacity of the creep.
     */
    get capacity () {
        if (this._cache.capacity !== undefined) {
            return this._cache.capacity;
        }
        this._cache.capacity = this._creep.store.getCapacity();
        return this._cache.capacity;
    }

    /**
     * Gets the work strength of the creep.
     */
    get strength () {
        if (this._cache.strength !== undefined) {
            return this._cache.strength;
        }
        this._cache.strength = this._creep.getActiveBodyparts(WORK);
        return this._cache.strength;
    }

    /**
     * Gets the amount of energy callculated to be held by the creep at the end of the work cycle.
     */
    get energy () {
        return this._energy;
    }

    /**
     * Gets the amount of resources calculated to be carried by the creep at the end of the work cycle.
     */
    get load () {
        return this._energy + this._minerals;
    }

    /**
     * Gets a value indicating whether the creep is working.
     */
    get isWorking () {
        return !!this._mem.isworking;
    }

    /**
     * Sets a value indicating whether the creep is working.
     */
    set isWorking (value) {
        this._mem.isworking = !!value;
    }

    /**
     * Determine what task the creep should undertake this tick.
     */
    getTask () {
        const task = super.getTask();
        if (task !== null) {
            return task;
        }

        if (this._creep.hits < this._creep.hitsMax) {
            return 'retreating';
        }

        return null;
    }

    /**
     * Perform a retreat if the creep is hurt.
     */
    retreating () {
        if (!this.isHome) {
            this.moveTo(this.moveToRoom(this._mem.rooms.home, false));
            return true;
        }
        else {
            const flag = this.pos.findClosestByRange(FIND_FLAGS, { filter: (f) => f.color === COLOR_BLUE });
            if (flag) {
                this.moveTo(flag);
            }
        }
    }

    /**
     * This function is a wrapper for creep.build().
     * It helps keep track of the amount of cargo currently in the creep.
     * 
     * @param {ConstructionSite} target - The target construction site.
     */
    build (target) {
        if (this._performedWork.build) {
            return ERR_BUSY;
        }

        const res = this._creep.build(target);

        if (res === OK) {
            this._energy = Math.max(0, this._energy - (this.strength * C.BUILD_COST));
            this._performedWork.build = true;
        }
        return res;
    }

    /**
     * This function is a wrapper for creep.repair().
     * It helps keep track of the amount of cargo currently in the creep.
     * 
     * @param {Structure} target - The target structure to repair.
     */
    repair (target) {
        if (this._performedWork.repair) {
            return ERR_BUSY;
        }

        const res = this._creep.repair(target);

        if (res === OK) {
            this._energy = Math.max(0, this._energy - (this.strength * C.REPAIR_COST));
            this._performedWork.repair = true;
        }
        return res;
    }

    /**
     * This function is a wrapper for creep.upgradeController().
     * It helps keep track of the amount of cargo currently in the creep.
     * 
     * @param {StructureController} target - The controller to upgrade.
     */
    upgrade (target) {
        if (this._performedWork.upgrade) {
            return ERR_BUSY;
        }

        const res = this._creep.upgradeController(target);

        if (res === OK) {
            this._energy = Math.max(0, this._energy - (this.strength * C.UPGRADE_COST));
            this._performedWork.upgrade = true;
        }
        return res;
    }

    /**
     * This function is a wrapper for creep.harvest().
     * It helps keep track of the amount of cargo currently in the creep.
     * 
     * @param {Source|Mineral} target - The mineral node to harvest from.
     */
    harvest (target) {
        if (this._performedWork.harvest) {
            return ERR_BUSY;
        }

        const res = this._creep.harvest(target);

        if (res === OK) {
            if (target instanceof Source) {
                this._energy = Math.min(this.capacity, this._energy + (this.strength * C.HARVEST_ENERGY_GAIN));
            }

            if (target instanceof Mineral) {
                this._minerals = Math.min(this.capacity, this._minerals + (this.strength * C.HARVEST_MINERAL_GAIN));
            }
            this._performedWork.harvest = true;
        }
        return res;
    }

    /**
     * This function is a wrapper for creep.drop().
     * It helps keep track of the amount of cargo currently in the creep.
     * 
     * @param {string} resourceType - One of the RESOURCE_* constants indicating what resource to drop.
     */
    drop (resourceType) {
        if (this._performedWork.drop) {
            return ERR_BUSY;
        }

        const carriedAmount = this.store.getUsedCapacity(resourceType);
        if (carriedAmount <= 0) {
            return ERR_NOT_ENOUGH_RESOURCES;
        }

        const res = this._creep.drop(resourceType);
        if (res === OK) {
            if (resourceType === RESOURCE_ENERGY) {
                this._energy = this._energy - carriedAmount;
            }
            else {
                this._minerals = this._minerals - carriedAmount;
            }
            this._performedWork.drop = true;
        }
        return res;
    }

    /**
     * This function is a wrapper for creep.pickup().
     * It helps keep track of the amount of cargo currently in the creep.
     * 
     * @param {Resource} target - The resource drop to pick up from the ground.
     */
    pickup (target) {
        if (this._performedWork.pickup) {
            return ERR_BUSY;
        }

        const res = this._creep.pickup(target);

        if (res === OK) {
            const creepSpace = this.capacity - this._minerals - this._energy;
            if (target.resourceType === RESOURCE_ENERGY) {
                this._energy = this._energy + Math.min(target.amount, creepSpace);
            }
            else {
                this._minerals = this._minerals + Math.min(target.amount, creepSpace);
            }
            this._performedWork.pickup = true;
        }
        return res;
    }

    /**
     * This function is a wrapper for creep.transfer().
     * It helps keep track of the amount of cargo currently in the creep.
     * 
     * @param {Structure} target - The structure to transfer the resource to.
     * @param {string} resourceType - One of the RESOURCE_* constants indicating what resource to transfer.
     */
    transfer (target, resourceType) {
        if (this._performedWork.transfer) {
            return ERR_BUSY;
        }

        const targetSpace = target.store.getFreeCapacity(resourceType);
        const carriedAmount = this.store[resourceType];
        const transferAmount = Math.min(targetSpace, carriedAmount);
        if (transferAmount <= 0) {
            return ERR_NOT_ENOUGH_RESOURCES;
        }

        const res = this._creep.transfer(target, resourceType, transferAmount);

        if (res === OK) {
            if (resourceType === RESOURCE_ENERGY) {
                this._energy = this._energy - transferAmount;
            }
            else {
                this._minerals = this._minerals - transferAmount;
            }
            this._performedWork.transfer = true;
        }
        return res;
    }

    /**
     * This function is a wrapper for creep.withdraw().
     * It helps keep track of the amount of cargo currently in the creep.
     * 
     * @param {Structure} target - The structure to withdraw resources from.
     * @param {string} resourceType - One of the RESOURCE_* constants indicating what resource to withdraw.
     */
    withdraw (target, resourceType) {
        if (this._performedWork.withdraw) {
            return ERR_BUSY;
        }

        const amountStored = target.store[resourceType];
        const restCapacity = this.capacity - Math.max(this.load, this._creep.store.getUsedCapacity());
        const amountTransfered = Math.min(amountStored, restCapacity);

        if (amountTransfered <= 0) {
            return ERR_NOT_ENOUGH_RESOURCES;
        }

        const res = this._creep.withdraw(target, resourceType, amountTransfered);

        if (res === OK) {
            if (resourceType === RESOURCE_ENERGY) {
                this._energy = this._energy + amountTransfered;
            }
            else {
                this._minerals = this._minerals + amountTransfered;
            }
            this._performedWork.withdraw = true;
        }
        return res;
    }
}

module.exports = CreepWorker;
