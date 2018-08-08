'use strict';

let CreepBase = require('Creep.Base');
let CreepMiner = require('Creep.Miner');
let CreepHauler = require('Creep.Hauler');
let CreepBuilder = require('Creep.Builder');
let CreepUpgrader = require('Creep.Upgrader');
let CreepRemoteUpgrader = require('Creep.RemoteUpgrader');

let CreepSoldier = require('Creep.Soldier');
let CreepSettler= require('Creep.Settler');

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
                return new CreepMiner(creep);
                
            case 'remotebuilder':
                return new CreepBuilder(creep);
                
            case 'remoteupgrader':
                return new CreepRemoteUpgrader(creep);
                
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