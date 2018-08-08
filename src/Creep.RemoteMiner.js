'use strict';

let CreepWorker = require('Creep.Worker');

/**
 * Wrapper class for creeps with logic for a remote miner.
 */
class CreepRemoteMiner extends CreepWorker {   
    /**
     * Initializes a new instance of the CreepMiner class with the specified creep.
     * 
     * @param {Creep} creep - The creep to be wrapped
     */
    constructor(creep) {
        super(creep);
        this.activity = "mining";
    }

    get HomeRoom() {
        return this.getMem("homeroom");
    }

    get RemoteRoom() {
        return this.getMem("remoteroom");
    }
    
    /**
     * Perform mining related logic.
     * 
     * @returns {Boolean} true if the creep has successfully performed some work.
     */
    work() {
        if (this.creep.carry.energy < this.creep.carryCapacity) {
            if (this.getRoom().room.name !== this.RemoteRoom) {
                let exitDir = this.getRoom().room.findExitTo(this.RemoteRoom);
                let exit = this.creep.pos.findClosestByRange(exitDir);
                this.creep.moveTo(exit);
            }
            else {
                let source = this.getSource();
            
                if (source !== null) {
                    if (this.creep.harvest(source) === ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(source);
                    }
                }
            }
        }
        else {
            let storage = this.creep.room.storage;
                            
            if (storage !== undefined) {
                if (this.creep.pos.isNearTo(storage)) {
                    this.creep.transfer(storage, RESOURCE_ENERGY);
                }
                else {
                    this.creep.moveTo(storage);
                }
            }
        }

        return true;
    }
    
    /**
     * Perform miner specific retirement logic. 
     * A miner at less than a low number of ticks left to live will unassign themself from a room mining node, but continue to mine.
     * 
     * @returns {Boolean} Always false.
     */
    retire() {
        if (this.creep.ticksToLive <= 5) {
            this.getRoom().removeMiner(this.creep.name);
        }

        return false; 
    }
    
    /**
     * Get the source reserved by this miner. If no source has been reserved, then attempt to reserve one.
     * 
     * @returns {Source} The source that the miner has reserved if available.
     */
    getSource()
    {
        if (this.getMem("source") === null) {
            this.setMem("source", this.getRoom().getMiningNode(this.creep.name));
        }

        return Game.getObjectById(this.getMem("source").sourceId);
    }
}

module.exports = CreepRemoteMiner;
