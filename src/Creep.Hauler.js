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
        let pickedUpDrops = false;
        
        if (this.Carry < this.creep.carryCapacity) {
            let drops = this.creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);

            if (drops.length > 1) {
                for (let drop of drops) {
                    if (drop.resourceType !== RESOURCE_ENERGY) { // Wait with energy for last.
                        let pickupResult = this.creep.pickup(drop);
                        if (pickupResult === OK) {
                            this.Carry = Math.min(this.Carry + drop.amount, this.creep.carryCapacity);
                            pickedUpDrops = true;
                        }
                    }
                }
            }
            
            if (drops.length === 1) {
                let pickupResult = this.creep.pickup(drops[0]);
                if (pickupResult === OK) {
                    this.Carry = Math.min(this.Carry + drops[0].amount, this.creep.carryCapacity);
                    pickedUpDrops = true;
                }
            }
        }

        if (!pickedUpDrops && this.Carry < this.creep.carryCapacity) {
            for (let container of this.creep.pos.findInRange(this.Room.getContainers(), 1)) {
                //Object.keys(container.store).length;
                for(let resourceType in container.store) {
                    let amount = container.store[resourceType];
                    if (amount > 0) {
                        let withdrawResult = this.creep.withdraw(container, resourceType);
                        if (withdrawResult === OK) {
                            this.Carry = Math.min(this.Carry + amount, this.creep.carryCapacity);
                        }
                    }
                }
            }
        }

        if (!this.IsWorking && this.Carry >= 0) {
            for (let structure of this.creep.pos.findInRange(FIND_STRUCTURES, 1)) {
                if (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE) {
                    let space = structure.storeCapacity - _.sum(structure.store);
                    for (let resourceType in this.creep.carry) {
                        let transferResult = this.creep.transfer(structure, resourceType);
                        if (transferResult === OK) {
                            let amount = this.creep.carry[resourceType];
                            let transfered = Math.min(space, amount);
                            if (resourceType === RESOURCE_ENERGY) {
                                this.Energy = this.Energy - transfered;
                            }
                            this.Carry = this.Carry - transfered;
                        }
                    }
                }

                if (structure.structureType === STRUCTURE_SPAWN || structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_LINK) {
                    let space = structure.energyCapacity - structure.energy;
                    let transferResult = this.creep.transfer(structure, RESOURCE_ENERGY);
                    if (transferResult === OK) {
                        let transfered = Math.min(space, this.Energy);
                        this.Energy = this.Energy - transfered;
                        this.Carry = this.Carry - transfered;
                    }
                }
            }
        }

        if (this.Carry <= 0) {
            this.IsWorking = true;
            // Need to find more stuff to carry.
        }

        if (this.Carry >= this.creep.carryCapacity) {
            this.IsWorking = false;
            // Need to deliver the load.
        }

        let moveTarget = null;

        if (this.IsWorking) {
            if (!this.AtWork) {
                this.moveToRoom(this.WorkRoom);
            }
            else {
                if (!moveTarget) {
                    let drops = this.creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { 
                        filter: function (d) { 
                            return d.amount > 20; 
                        } 
                    });
                    
                    if (drops) {
                        if (!this.creep.pos.isNearTo(drops)) {
                            moveTarget = drops.pos;
                        }
                    }
                }

                if (!moveTarget) {
                    let container = null;
                    for (let c of this.WorkRoom.getContainers()) {
                        if (!container || _.sum(c.store) > _.sum(container.store)) {
                            container = c;
                        }
                    }

                    if (container !== null) {
                        if (!this.creep.pos.isNearTo(container)) {
                            moveTarget = container.pos;
                        }
                    }
                }
            }
        }
        else {
            if (!this.AtHome) {
                this.moveToRoom(this.HomeRoom);
            }
            else {
                if (!moveTarget) {
                    if (this.Room.Storage) {
                        moveTarget = this.Room.Storage;
                    }
                }

                if (!moveTarget) {
                    let extension = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                        filter: function (object) { 
                            return object.structureType === STRUCTURE_EXTENSION && (object.energy < object.energyCapacity); 
                        } 
                    });
                    if (extension) {
                        moveTarget = extension;
                    }
                }
            }
        }

        if (moveTarget) {
            this.moveTo(moveTarget);
        }

        return true;
    }
}

module.exports = CreepHauler;
