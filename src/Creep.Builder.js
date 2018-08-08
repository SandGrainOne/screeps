'use strict';

let CreepWorker = require('Creep.Worker');

/**
 * Wrapper class for creeps with logic for a builder.
 * Primary porpose of these creeps are to build and repair structures.
 */
class CreepBuilder extends CreepWorker {   
    /**
     * Initializes a new instance of the CreepBuilder class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep) {
        super(creep);
    }
    
    /**
     * Perform building and repair related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        if (this.Task === "charging") {
            if (this.creep.carry.energy < this.creep.carryCapacity) {
                if (!this.findStoredEnergy()) {
                    if (this.moveHome()) {
                        let source = this.creep.pos.findClosestByPath(FIND_SOURCES);
                        
                        if (source !== null) {
                            if (this.creep.harvest(source) === ERR_NOT_IN_RANGE) {
                                this.creep.moveTo(source);
                            }
                        }
                    }
                }
            }
            else {
                this.Task = "building";
            }
        }
        else {
            if (this.creep.carry.energy > 0) {
                if (this.moveOut()) {
                    let containerToRepair = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                        filter: function (structure) { 
                            return structure.structureType === STRUCTURE_CONTAINER && (structure.hits < structure.hitsMax); 
                        }
                    });
                    
                    if (containerToRepair !== null) {
                        if (this.creep.repair(containerToRepair) === ERR_NOT_IN_RANGE) {
                            this.creep.moveTo(containerToRepair);
                        }
                        
                        return true;
                    }
                    
                    let rampartToRepair = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                        filter: function (wall) { 
                            return wall.structureType === STRUCTURE_RAMPART && (wall.hits < 120000); 
                        } 
                    });
                    
                    if (rampartToRepair !== null) {
                        if (this.creep.repair(rampartToRepair) === ERR_NOT_IN_RANGE) {
                            this.creep.moveTo(rampartToRepair);
                        }

                        return true;
                    } 
                    
                    let target = this.creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

                    if (target !== null) {                        
                        if (this.creep.build(target) === ERR_NOT_IN_RANGE) {
                            this.creep.moveTo(target);
                        }
                        
                        return true;
                    }
                    
                    let roadToRepair = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                        filter: function (road) { 
                            return road.structureType === STRUCTURE_ROAD && (road.hits < road.hitsMax); 
                        } 
                    });
                    
                    if (roadToRepair !== null) {
                        if (this.creep.repair(roadToRepair) === ERR_NOT_IN_RANGE) {
                            this.creep.moveTo(roadToRepair);
                        }
                        
                        return true;
                    }

                    let wallToRepair = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                        filter: function (wall) { 
                            return wall.structureType === STRUCTURE_WALL && (wall.hits < 100000); 
                        } 
                    });
                    
                    if (wallToRepair !== null) {
                        if (this.creep.repair(wallToRepair) === ERR_NOT_IN_RANGE) {
                            this.creep.moveTo(wallToRepair);
                        }

                        return true;
                    }
                }
            }
            else {
                this.Task = "charging";
            }
        }
        
        return true;
    }
}

module.exports = CreepBuilder;
