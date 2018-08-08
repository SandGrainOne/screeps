'use strict';

module.exports = {
    run(creep, next)
    {
        if (creep.carry.energy != 0)
        {
            let spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
            
            if (spawn !== null && spawn.energy < spawn.energyCapacity)
            {
                if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    if (creep.fatigue == 0)
                    {
                        creep.moveTo(spawn);
                        return;
                    }
                }
            }
            else
            {
                let extension = creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                    filter: function (object) { 
                        return object.structureType === STRUCTURE_EXTENSION && (object.energy < object.energyCapacity); 
                    } 
                });

                if (extension != undefined)
                {
                    if (creep.transfer(extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        if (creep.fatigue == 0)
                        {
                            creep.moveTo(extension);
                            return;
                        }
                    }
                }
                else
                {
                    
                    let tower = creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                        filter: function (object) { 
                            return object.structureType === STRUCTURE_TOWER && (object.energy < object.energyCapacity); 
                        } 
                    });

                    if (tower != undefined)
                    {
                        if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        {
                            if (creep.fatigue == 0)
                            {
                                creep.moveTo(tower);
                                return;
                            }
                        }
                    }
                    else
                    {
                        let storage = creep.room.storage;
                        
                        if (storage !== undefined)
                        {
                            if (creep.pos.isNearTo(storage))
                            {
                                creep.transfer(storage, RESOURCE_ENERGY);
                            }
                            else
                            {
                                creep.moveTo(storage);
                                return;
                            }
                        }
                        else
                        {
                            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                                filter: function (object) { 
                                    return object.structureType === STRUCTURE_CONTAINER && (object.store.energy < object.storeCapacity); 
                                } 
                            });
    
                            if (container != undefined)
                            {
                                if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                                {
                                    if (creep.fatigue == 0)
                                    {
                                        creep.moveTo(container);
                                        return;
                                    }
                                }
                            }
                            else
                            {
                                if (spawn !== null && !creep.pos.inRangeTo(spawn, 2))
                                {
                                    creep.moveTo(spawn);
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        }
        else
        {
            creep.memory.task = next;
        }
    }
};