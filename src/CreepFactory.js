'use strict';

let CreepBase = require('Creep.Base');
let CreepMiner = require('Creep.Miner');
let CreepHauler = require('Creep.Hauler');
let CreepBroker = require('Creep.Broker');
let CreepBuilder = require('Creep.Builder');
let CreepSettler = require('Creep.Settler');
let CreepSoldier = require('Creep.Soldier');
let CreepUpgrader = require('Creep.Upgrader');
let CreepRefueler = require('Creep.Refueler');
let CreepDefender = require('Creep.Defender');

class CreepFactory {
    /**
     * Add a layer of job spesific logic to the given creep.
     * 
     * @param {Creep} creep - The creep to be wrapped.
     */
    wrap(creep) {
        switch (creep.memory.job) {
            case 'miner':
                return new CreepMiner(creep);
                
            case 'hauler':
                return new CreepHauler(creep);
                
            case 'broker':
                return new CreepBroker(creep);
                
            case 'refueler':
                return new CreepRefueler(creep);
                
            case 'builder':
                return new CreepBuilder(creep);
                
            case 'upgrader':
                return new CreepUpgrader(creep);
                
            case 'defender':
                return new CreepDefender(creep);
                
            case 'soldier':
                return new CreepSoldier(creep);
                
            case 'settler':
                return new CreepSettler(creep);
            
            default:
                return new CreepBase(creep);
        }
    }
}

module.exports = CreepFactory;