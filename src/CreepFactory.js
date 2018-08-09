'use strict';

let C = require('constants');

let CreepBase = require('Creep.Base');
let CreepMiner = require('Creep.Miner');
let CreepHauler = require('Creep.Hauler');
let CreepBroker = require('Creep.Broker');
let CreepHealer = require('Creep.Healer');
let CreepBuilder = require('Creep.Builder');
let CreepSettler = require('Creep.Settler');
let CreepSoldier = require('Creep.Soldier');
let CreepUpgrader = require('Creep.Upgrader');
let CreepRefueler = require('Creep.Refueler');
let CreepDefender = require('Creep.Defender');
let CreepAttacker = require('Creep.Attacker');
let CreepBalancer = require('Creep.Balancer');
let CreepDismantler = require('Creep.Dismantler');

class CreepFactory {
    /**
     * Initializes a new instance of the CreepBase class with the specified creep.
     */
    constructor(knownRooms) {
        this.KnownRooms = knownRooms;
    }

    /**
     * Add a layer of job specific logic to the given creep.
     * 
     * @param {Creep} creep - The creep to be wrapped.
     */
    wrap(creep) {
        let smartCreep = null;

        switch (creep.memory.job) {
            case 'miner':
                smartCreep = new CreepMiner(creep);
                break;
            case 'hauler':
                smartCreep =  new CreepHauler(creep);
                break;
            case 'broker':
                smartCreep =  new CreepBroker(creep);
                break;
            case 'refueler':
                smartCreep =  new CreepRefueler(creep);
                break;
            case 'builder':
                smartCreep =  new CreepBuilder(creep);
                break;
            case 'upgrader':
                smartCreep =  new CreepUpgrader(creep);
                break;
            case 'defender':
                smartCreep =  new CreepDefender(creep);
                break;
            case 'healer':
                smartCreep =  new CreepHealer(creep);
                break;
            case 'attacker':
                smartCreep =  new CreepAttacker(creep);
                break;
            case 'soldier':
                smartCreep =  new CreepSoldier(creep);
                break;
            case 'settler':
                smartCreep =  new CreepSettler(creep);
                break;
            case 'balancer':
                smartCreep =  new CreepBalancer(creep);
                break;
            case 'dismantler':
                smartCreep =  new CreepDismantler(creep);
                break;
        }

        if (!smartCreep) {
            smartCreep = new CreepBase(creep);
        }

        smartCreep.Room = this.KnownRooms[smartCreep.creep.memory.rooms.current];
        smartCreep.HomeRoom = this.KnownRooms[smartCreep.creep.memory.rooms.home];
        smartCreep.WorkRoom = this.KnownRooms[smartCreep.creep.memory.rooms.work];

        return smartCreep;
    }

    /**
     * Build a body based on a shortened code.
     * 
     * Eg: 
     * WCMM => [WORK, CARRY, MOVE, MOVE]
     * LLMM => [CLAIM, CLAIM, MOVE, MOVE]
     */
    buildBody(codeChain) {
        let body = [];

        let codes = Array.from(codeChain);
        for (let code of codes) {
            body.push(C.BODY_PART_CODES[code]);
        }

        return body;
    }
}

module.exports = CreepFactory;