'use strict';

let C = require('constants');

let CreepWorker = require('Creep.Worker');

/**
 * Wrapper class for creeps with logic for a hauler.
 * Primary purpose of these creeps are to move resources from the perimeter of a room and into the center.
 */
class CreepHauler extends CreepWorker {   
    /**
     * Initializes a new instance of the CreepHauler class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep) {
        super(creep);
    }
    
    /**
     * Perform hauling related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        let carry = _.sum(this.creep.carry);
        let pickedUpDrops = false;
        
        if (this.creep.hits < this.creep.hitsMax) {
            this.moveHome();
            return true;
        }
        
        if (carry < this.creep.carryCapacity) {
            let drops = this.creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);

            if (drops.length > 1) {
                for (let drop of drops) {
                    if (drop.resourceType !== RESOURCE_ENERGY) { // Wait with energy for last.
                        if (this.creep.pickup(drop) === OK) {
                            carry = Math.min(carry + drop.amount, this.creep.carryCapacity);
                            pickedUpDrops = true;
                        }
                    }
                }
            }
            
            if (drops.length === 1) {
                if (this.creep.pickup(drops[0]) === OK) {
                    carry = Math.min(carry + drops[0].amount, this.creep.carryCapacity);
                    pickedUpDrops = true;
                }
            }
        }

        if (!pickedUpDrops && carry < this.creep.carryCapacity) {
            for (let container of this.creep.pos.findInRange(this.Room.getContainers(), 1)) {
                //Object.keys(container.store).length;
                for(let resourceType in container.store) {
                    let amount = container.store[resourceType];
                    if (amount > 0) {
                        if (this.creep.withdraw(container, resourceType) === OK) {
                            carry = Math.min(carry + amount, this.creep.carryCapacity);
                        }
                    }
                }
            }
        }

        if (this.Task === "hauling")  {
            if (carry < this.creep.carryCapacity) {
                if (this.moveOut()) {
                    
                    let drops = this.creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { 
                        filter: function (d) { 
                            return d.amount > 20; 
                        } 
                    });
                    
                    if (drops) {
                        if (!this.creep.pos.isNearTo(drops)) {
                            this.moveTo(drops);
                        }
                        return true;
                    }
                    
                    let container = null;
                    for (let c of this.WorkRoom.getContainers()) {
                        if (!container || _.sum(c.store) > _.sum(container.store)) {
                            container = c;
                        }
                    }

                    if (container !== null) {
                        if (!this.creep.pos.isNearTo(container)) {
                            this.moveTo(container);
                        }
                        return true;
                    }
                }
            }
            else {
                this.Task = "delivering";
            }
        }
        else {
            if (carry > 0) {
                if (this.moveHome()) {
                    let storage = this.Room.Storage;

                    if (storage) {
                        if (this.creep.pos.isNearTo(storage)) {
                            let space = storage.storeCapacity - _.sum(storage.store);
                            for(let resourceType in this.creep.carry) {
                                if (this.creep.transfer(storage, resourceType) === OK) {
                                    let amount = this.creep.carry[resourceType];
                                    let transfered = Math.min(space, amount);
                                }
                            }
                        }
                        else {
                            this.moveTo(storage);
                        }
                        return true;
                    }

                    let spawn = this.creep.pos.findClosestByPath(FIND_MY_SPAWNS);
                    if (spawn !== null && spawn.energy < spawn.energyCapacity) {
                        if (this.creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            this.moveTo(spawn);
                        }
                        return true;
                    }

                    let extension = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                        filter: function (object) { 
                            return object.structureType === STRUCTURE_EXTENSION && (object.energy < object.energyCapacity); 
                        } 
                    });
                    if (extension != undefined) {
                        if (this.creep.transfer(extension, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            this.moveTo(extension);
                        }
                        return true;
                    }

                    let tower = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                        filter: function (object) { 
                            return object.structureType === STRUCTURE_TOWER && (object.energy < object.energyCapacity - 200); 
                        } 
                    });

                    if (tower != undefined) {
                        if (this.creep.transfer(tower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            this.moveTo(tower);
                        }
                        return true;
                    }

                    let container = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                        filter: function (object) { 
                            return object.structureType === STRUCTURE_CONTAINER;
                        } 
                    });

                    if (container !== undefined) {
                        if (this.creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            this.moveTo(container);
                        }
                        return true;
                    }

                    if (spawn !== null && !this.creep.pos.inRangeTo(spawn, 2)) {
                        this.moveTo(spawn);
                        return true;
                    }
                }
            }
            else {
                this.Task = "hauling";
            }
        }
        
        return true;
    }
}

module.exports = CreepHauler;
