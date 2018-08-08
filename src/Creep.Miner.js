'use strict';

let CreepBase = require('Creep.Base');
let tools = require('tools');

/**
 * Wrapper class for creeps with logic for a miner.
 */
class CreepMiner extends CreepBase
{   
    /**
     * Initializes a new instance of the CreepMiner class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped with
     */
    constructor(creep)
    {
        super(creep);
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
            
            if (source === null)
            {
                return false;
            }
            
            if (this.creep.harvest(source) == ERR_NOT_IN_RANGE)
            {
                this.creep.moveTo(source);
            }
        }
        else
        {
            let haulers = this.creep.room.find(FIND_MY_CREEPS, {
                filter: (c) => {
                    return c.memory.role === "hauler" && c.carry.energy < c.carryCapacity
                }
            });
            
            if (_(haulers).size() > 0 )
            {
                let transfer = ERR_NOT_OWNER; // Actual error is not really important, yet.
                
                for (let hauler of haulers)
                {
                    if (this.creep.pos.isNearTo(hauler))
                    {
                        transfer = this.creep.transfer(hauler, RESOURCE_ENERGY);
                        continue;
                    }
                }
                
                if (transfer === OK)
                {
                    return true;
                }
            }
                
            let spawn = this.creep.pos.findClosestByPath(FIND_MY_SPAWNS);
            
            if (spawn !== null && spawn.energy < spawn.energyCapacity)
            {
                if (this.creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    this.creep.moveTo(spawn);
                    return true;
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
                    if (this.creep.transfer(extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        this.creep.moveTo(extension);
                        return true;
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
                        if (this.creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        {
                            this.creep.moveTo(tower);
                            return true;
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
                            
                            return true;
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
                                if (this.creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                                {
                                    this.creep.moveTo(container);
                                    return true;
                                }
                            }
                            else
                            {
                                if (spawn !== null && !this.creep.pos.inRangeTo(spawn, 2))
                                {
                                    this.creep.moveTo(spawn);
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
        
        if ((Game.time + tools.getRandomInt(0, 15)) % 8 === 0)
        {
            this.creep.say("mining");
        }
        
        return true;
    }
}

module.exports = CreepMiner;
