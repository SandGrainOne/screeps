'use strict';

let CreepBase = require('Creep.Base');
let CreepMiner = require('Creep.Miner');
let CreepHauler = require('Creep.Hauler');
let CreepBuilder = require('Creep.Builder');
let CreepUpgrader = require('Creep.Upgrader');
let CreepRepairer = require('Creep.Repairer');

class CreepFactory
{
    wrap(creep)
    {
        switch (creep.memory.role) {
            case 'miner':
                return new CreepMiner(creep);
                
            case 'hauler':
                return new CreepHauler(creep);
                
            case 'builder':
                return new CreepBuilder(creep);
                
            case 'upgrader':
                return new CreepUpgrader(creep);
                
            case 'repairer':
                return new CreepRepairer(creep);
            
            default:
                return new CreepBase(creep);
        }
    }
}

module.exports = CreepFactory;