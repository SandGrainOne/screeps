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

        this._baseStrength = this.creep.getActiveBodyparts(WORK);

        this._capacity = this.creep.getActiveBodyparts(CARRY) * 50;

        this._startEnergy = this.creep.carry.energy;
        this._startLoad =_.sum(this.creep.carry);

        this._energy = this._startEnergy;
        this._minerals = this._startLoad - this._startEnergy;

        this._performedWork = {};
    }

    /**
     * Gets the carry capacity of the creep.
     */
    get capacity() {
        return this._capacity;
    }

    /**
     * Gets the work strength of the creep.
     */
    get strength() {
        return this._baseStrength;
    }

    /**
     * Gets the amount of energy callculated to be held by the creep at the end of the work cycle.
     */
    get energy() {
        return this._energy;
    }

    /**
     * Gets the amount of resources callculated to be carried by the creep at the end of the work cycle.
     */
    get load() {
        return this._energy + this._minerals;
    }

    /**
     * Gets a value indicating whether the creep is working.
     */
    get isWorking() {
        return !!this.mem.isworking;
    }

    /**
     * Sets a value indicating whether the creep is working.
     */
    set isWorking(value) {
        this.mem.isworking = !!value;
    }

    /**
     * Perform a retreat if the creep is hurt.
     * 
     * @returns {Boolean} true if the creep is retreating
     */
    retreat() {
        if (this.creep.hits < this.creep.hitsMax) {
            if (!this.isHome) {
                this.moveTo(this.moveToRoom(this.HomeRoom.name, false));
                return true;
            }
            else {
                let flag = this.creep.pos.findClosestByRange(FIND_FLAGS, { filter: (f) => f.color === COLOR_BLUE });
                if (flag) {
                    this.moveTo(flag);
                }
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
        if (this._performedWork.build) {
            return ERR_BUSY;
        }

        let res = this.creep.build(target);
        if (res === OK) {
            this._energy = Math.max(0, this._energy - (this._baseStrength * C.BUILD_COST));
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
    repair(target) {
        if (this._performedWork.repair) {
            return ERR_BUSY;
        }

        let res = this.creep.repair(target);
        if (res === OK) {
            this._energy = Math.max(0, this._energy - (this._baseStrength * C.REPAIR_COST));
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
    upgrade(target) {
        if (this._performedWork.upgrade) {
            return ERR_BUSY;
        }

        let res = this.creep.upgradeController(target);
        if (res === OK) {
            this._energy = Math.max(0, this._energy - (this._baseStrength * C.UPGRADE_COST));
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
    harvest(target) {
        if (this._performedWork.harvest) {
            return ERR_BUSY;
        }

        let res = this.creep.harvest(target);
        if (res === OK) {
            if (target instanceof Source) {
                this._energy = Math.min(this._capacity, this._energy + (this._baseStrength * C.HARVEST_ENERGY_GAIN));
            }        
            if (target instanceof Mineral) {
                this._minerals = Math.min(this._capacity, this._minerals + (this._baseStrength * C.HARVEST_MINERAL_GAIN));
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
    drop(resourceType) {
        if (this._performedWork.drop) {
            return ERR_BUSY;
        }

        let carriedAmount = this.creep.carry[resourceType];
        if (carriedAmount <= 0) {
            return ERR_NOT_ENOUGH_RESOURCES;
        }

        let res = this.creep.drop(resourceType);
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
    pickup(target) {
        if (this._performedWork.pickup) {
            return ERR_BUSY;
        }

        let res = this.creep.pickup(target);
        if (res === OK) {
            let creepSpace = this._capacity - this._minerals - this._energy;
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
     * @param {string} resourceType - One of the RESOURCE_* constants indicating what resource to drop.
     */
    transfer(target, resourceType) {
        if (this._performedWork.transfer) {
            return ERR_BUSY;
        }

        let targetSpace = 0;
        if (target.storeCapacity) {
            // Containers, Storage, Terminal, etc. Can hold anything. Resource type irrelevant
            targetSpace = target.storeCapacity - _.sum(target.store);
        }
        else {
            if (resourceType === RESOURCE_ENERGY) {
                if (target.energyCapacity) {
                    // Links, Labs (energy), Spawns, Towers, etc. 
                    targetSpace = target.energyCapacity - target.energy;
                }
            }
            else if (resourceType === RESOURCE_POWER) {
                if (target.powerCapacity) {
                    // PowerSpawn
                    targetSpace = target.powerCapacity - target.power;
                }
            }
            else {
                if (target.mineralCapacity) {
                    // Labs (mineral)
                    if (target.mineralType === null || target.mineralType === resourceType) {
                        targetSpace = target.mineralCapacity - target.mineralAmount;
                    }
                }
            }
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
                this._minerals = this._minerals - amountTransfered;
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
     * @param {string} resourceType - One of the RESOURCE_* constants indicating what resource to drop.
     */
    withdraw(target, resourceType) {
        if (this._performedWork.withdraw) {
            return ERR_BUSY;
        }

        let amountStored = 0;
        if (target.store) {
            // Containers, Storage, Terminal, etc
            amountStored = target.store[resourceType];
        }
        else {
            if (resourceType === RESOURCE_ENERGY) {
                // Labs(energy), Links, Spawns etc.
                amountStored = target.energy;
            }
            else if (resourceType === RESOURCE_POWER) {
                if (target.power) {
                    // PowerSpawn
                    amountStored = target.power;
                }
            }
            else {
                if (target.mineralAmount) {
                    // Labs (mineral)
                    if (target.mineralType !== null && target.mineralType === resourceType) {
                        amountStored = target.mineralAmount;
                    }
                }
            }
        }

        let restCapacity = this._capacity - this._minerals - this._energy;
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
                this._minerals = this._minerals + amountTransfered;
            }
            this._performedWork.withdraw = true;
        }
        return res;
    }
}

module.exports = CreepWorker;
