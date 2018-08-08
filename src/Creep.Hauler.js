'use strict';

let CreepBase = require('Creep.Base');

/**
 * Wrapper class for creeps with logic for a miner.
 */
class CreepHauler extends CreepBase
{   
    /**
     * Initializes a new instance of the CreepHauler class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep)
    {
        super(creep);
        this.activity = "hauling";
    }
    
    /**
     * Perform hauling related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work()
    {
        if (this.creep.carry.energy < this.creep.carryCapacity)
        {
            let miners = this.creep.room.find(FIND_MY_CREEPS, { 
                filter: function (creep) { 
                    return creep.memory.role === "miner"; 
                } 
            });
            
            if (miners.length)
            {
                if (!this.creep.pos.isNearTo(miners[0]))
                {
                    this.creep.moveTo(miners[0]);
                }
            }
        }
        else
        {
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

module.exports = CreepHauler;
