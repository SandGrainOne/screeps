'use strict';

let CreepBase = require('Creep.Base');

/**
 * Wrapper class for creeps with logic for a miner.
 * Primary purpose of these creeps are to harvest energy or minerals.
 */
class CreepMiner extends CreepBase {
    /**
     * Initializes a new instance of the CreepMiner class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep) {
        super(creep);
    }

    get IsParked() {
        if (!this.getMem("isparked")) {
            if (!this.creep.pos.isNearTo(this.getSource())) {
                return false;
            }
            
            for (let obj of this.creep.pos.look()) {
                if ( obj.type === "structure") {
                    if (obj.structure.structureType === "container") {
                        this.setMem("isparked", true);
                        return true;
                    }
                }
            }
        }

        return !!this.getMem("isparked");
    }
    
    /**
     * Perform mining related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        if (this.creep.carry.energy < this.creep.carryCapacity) {
            if (this.moveOut()) {

                let source = this.getSource();
                
                if (source !== null) {
                    if (this.IsParked) {
                        this.creep.harvest(source);
                        this.creep.drop(RESOURCE_ENERGY);
                        return true;
                    }
                    if (this.creep.harvest(source) === ERR_NOT_IN_RANGE) {
                        let result = this.creep.moveTo(source);
                    }
                }
            }
        }
        else {
            if (this.moveHome()) {
                let container = this.creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: function (s) { 
                        return (s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < s.storeCapacity) || 
                               (s.structureType === STRUCTURE_LINK && s.energy < s.energyCapacity); 
                    } 
                });
                
                if (container != undefined) {
                    if (this.creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(container);
                    }
                    return true;
                }

                let spawn = this.creep.pos.findClosestByPath(FIND_MY_SPAWNS, { 
                    filter: function (s) { 
                        return s.structureType === STRUCTURE_EXTENSION && (s.energy < s.energyCapacity); 
                    } 
                });
                
                if (spawn !== null) {
                    if (this.creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(spawn);
                    }
                    return true;
                }

                let extension = this.creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                    filter: function (s) { 
                        return s.structureType === STRUCTURE_EXTENSION && (s.energy < s.energyCapacity); 
                    } 
                });

                if (extension != undefined) {
                    if (this.creep.transfer(extension, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(extension);
                    }
                    return true;
                }
            }
        }

        return true;
    }
    
    /**
     * Get the source reserved by this miner. If no source has been reserved, then attempt to reserve one.
     * 
     * @returns {Source} The source that the miner has reserved if available.
     */
    getSource() {
        if (this.getMem("source")) {
            return Game.getObjectById(this.getMem("source").id);
        }

        let source = this.Room.getMiningNode(this.creep.name);
        if (!source) {
            return null;
        }
        
        this.setMem("source", source);
        return Game.getObjectById(source.id);
    }
}

module.exports = CreepMiner;
