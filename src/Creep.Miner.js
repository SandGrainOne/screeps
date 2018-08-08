'use strict';

let CreepWorker = require('Creep.Worker');

/**
 * Wrapper class for creeps with logic for a miner.
 */
class CreepMiner extends CreepWorker
{   
    /**
     * Initializes a new instance of the CreepMiner class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep)
    {
        super(creep);
        this.activity = "mining";
    }
    
    /**
     * Perform mining related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work()
    {
        if (this.creep.carry.energy < this.creep.carryCapacity)
        {
            let source = this.creep.pos.findClosestByPath(FIND_SOURCES);
            
            if (source !== null)
            {
                if (this.creep.harvest(source) === ERR_NOT_IN_RANGE)
                {
                    this.creep.moveTo(source);
                }
            }
        }
        else
        {
            let haulers = this.creep.room.find(FIND_MY_CREEPS, {
                filter: (c) => {
                    return c.memory.role === "hauler" && c.carry.energy < c.carryCapacity
                }
            });
            
            if (haulers.length)
            {
                let result = ERR_FULL; // Type of error is not important.
                
                for (let hauler of haulers)
                {
                    if (this.creep.pos.isNearTo(hauler))
                    {
                        result = this.creep.transfer(hauler, RESOURCE_ENERGY);
                        break;
                    }
                }
                
                if (result === OK) {
                    return true;
                }
            }

            let spawn = this.creep.pos.findClosestByPath(FIND_MY_SPAWNS);
            
            if (spawn !== null && spawn.energy < spawn.energyCapacity)
            {
                if (this.creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
                {
                    this.creep.moveTo(spawn);
                }
            }
            else
            {
                let extension = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                    filter: function (object) { 
                        return object.structureType === STRUCTURE_EXTENSION && (object.energy < object.energyCapacity); 
                    } 
                });

                if (extension != undefined)
                {
                    if (this.creep.transfer(extension, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
                    {
                        this.creep.moveTo(extension);
                    }
                }
                else
                {
                    let tower = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                        filter: function (object) { 
                            return object.structureType === STRUCTURE_TOWER && (object.energy < object.energyCapacity); 
                        } 
                    });

                    if (tower != undefined)
                    {
                        if (this.creep.transfer(tower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
                        {
                            this.creep.moveTo(tower);
                        }
                    }
                    else
                    {
                        let storage = this.creep.room.storage;
                        
                        if (storage !== undefined)
                        {
                            if (this.creep.pos.isNearTo(storage))
                            {
                                this.creep.transfer(storage, RESOURCE_ENERGY);
                            }
                            else
                            {
                                this.creep.moveTo(storage);
                            }
                        }
                        else
                        {
                            let container = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                                filter: function (object) { 
                                    return object.structureType === STRUCTURE_CONTAINER && (object.store.energy < object.storeCapacity); 
                                } 
                            });
                            
                            if (container != undefined)
                            {
                                if (this.creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
                                {
                                    this.creep.moveTo(container);
                                }
                            }
                            else
                            {
                                if (spawn !== null && !this.creep.pos.inRangeTo(spawn, 2))
                                {
                                    this.creep.moveTo(spawn);
                                }
                            }
                        }
                    }
                }
            }
        }
        
        return true;
    }
}

module.exports = CreepMiner;
