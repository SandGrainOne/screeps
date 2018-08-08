'use strict';

let CreepBase = require('Creep.Base');
let CreepMiner = require('Creep.Miner');
let CreepHauler = require('Creep.Hauler');
let CreepCurator = require('Creep.Curator');
let CreepUpgrader = require('Creep.Upgrader');

class CreepFactory
{
    wrap(creep)
    {
        switch (creep.memory.role) {
            case 'miner':
                return new CreepMiner(creep);
                
            case 'hauler':
                return new CreepHauler(creep);
                
            case 'curator':
                return new CreepCurator(creep);
                
            case 'upgrader':
                return new CreepUpgrader(creep);
            
            default:
                return new CreepBase(creep);
        }
    }
}

module.exports = CreepFactory;