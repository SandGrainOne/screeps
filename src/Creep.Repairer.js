'use strict';

let CreepWorker = require('Creep.Worker');

/**
 * Wrapper class for creeps with logic for a repairer.
 */
class CreepRepairer extends CreepWorker
{   
    /**
     * Initializes a new instance of the CreepRepairer class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep)
    {
        super(creep);
        this.activity = "repairing";
    }
    
    /**
     * Perform repair related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work()
    {
        if (this.getTask() === "harvesting")
        {
            if (this.creep.carry.energy < this.creep.carryCapacity) 
            {
                if (!this.findStoredEnergy())
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
            }
            else
            {
                this.setTask("repair");
            }
        }
        else
        {
            if (this.creep.carry.energy > 0) 
            {
                let containerToRepair = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                    filter: function (structure) { 
                        return structure.structureType === STRUCTURE_CONTAINER && (structure.hits < structure.hitsMax); 
                    }
                });
                
                if (containerToRepair !== null)
                {
                    if (this.creep.repair(containerToRepair) === ERR_NOT_IN_RANGE)
                    {
                        this.creep.moveTo(containerToRepair);
                    }
                    
                    return true;
                }
                
                let roadToRepair = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                    filter: function (road) { 
                        return road.structureType === STRUCTURE_ROAD && (road.hits < road.hitsMax); 
                    } 
                });
                
                if (roadToRepair !== null)
                {
                    if (this.creep.repair(roadToRepair) === ERR_NOT_IN_RANGE)
                    {
                        this.creep.moveTo(roadToRepair);
                    }
                    
                    return true;
                }
                
                let wallToRepair = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                    filter: function (wall) { 
                        return wall.structureType === STRUCTURE_WALL && (wall.hits < wall.hitsMax); 
                    } 
                });
                
                if (wallToRepair !== null)
                {
                    if (this.creep.repair(wallToRepair) === ERR_NOT_IN_RANGE)
                    {
                        this.creep.moveTo(wallToRepair);
                    }
                }
                
                let spawn = this.creep.pos.findClosestByPath(FIND_MY_SPAWNS);
                
                if (spawn !== null && !this.creep.pos.inRangeTo(spawn, 2))
                {
                    this.creep.moveTo(spawn);
                }
            }
            else
            {
                this.setTask("harvesting");
            }
        }
        
        return true;
    }
}

module.exports = CreepRepairer;
