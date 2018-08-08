'use strict';

let CreepBase = require('Creep.Base');
let CreepMiner = require('Creep.Miner');
let CreepHauler = require('Creep.Hauler');
let CreepBuilder = require('Creep.Builder');
let CreepUpgrader = require('Creep.Upgrader');
let CreepRemoteMiner = require('Creep.RemoteMiner');

let CreepSoldier = require('Creep.Soldier');

class CreepFactory
{
    wrap(creep) {
        switch (creep.memory.role) {
            case 'miner':
                return new CreepMiner(creep);
                
            case 'hauler':
                return new CreepHauler(creep);
                
            case 'builder':
                return new CreepBuilder(creep);
                
            case 'upgrader':
                return new CreepUpgrader(creep);
                
            case 'remoteminer':
                return new CreepRemoteMiner(creep);
                
            case 'soldier':
                return new CreepSoldier(creep);
            
            default:
                return new CreepBase(creep);
        }
    }
}

module.exports = CreepFactory;