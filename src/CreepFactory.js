'use strict';

let C = require('constants');

let CreepBase = require('Creep.Base');
let CreepMiner = require('Creep.Miner');
let CreepHauler = require('Creep.Hauler');
let CreepBroker = require('Creep.Broker');
let CreepLinker = require('Creep.Linker');
let CreepHealer = require('Creep.Healer');
let CreepChemist = require('Creep.Chemist');
let CreepBuilder = require('Creep.Builder');
let CreepSettler = require('Creep.Settler');
let CreepSoldier = require('Creep.Soldier');
let CreepUpgrader = require('Creep.Upgrader');
let CreepRefueler = require('Creep.Refueler');
let CreepDefender = require('Creep.Defender');
let CreepAttacker = require('Creep.Attacker');
let CreepPatroler = require('Creep.Patroler');
let CreepBalancer = require('Creep.Balancer');
let CreepDismantler = require('Creep.Dismantler');

class CreepFactory {
    /**
     * Initializes a new instance of the CreepBase class with the specified creep.
     */
    constructor() {
    }

    /**
     * Add a layer of job specific logic to the given creep.
     * 
     * @param {Creep} creep - The creep to be wrapped.
     */
    wrap(creep) {
        let smartCreep = null;

        let job = creep.memory.job;
        if (job.name) {
            job = job.name;
        }

        switch (job) {
            case 'miner':
            case 'mineralminer':
                smartCreep = new CreepMiner(creep);
                break;
            case 'hauler':
                if (creep.name === "FFF") {
                    smartCreep = new CreepHauler(creep);
                }
                else {
                    smartCreep =  new CreepHauler(creep);
                }
                break;
            case 'broker':
                smartCreep =  new CreepBroker(creep);
                break;
            case 'linker':
                smartCreep =  new CreepLinker(creep);
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
            case 'patroler':
                smartCreep =  new CreepPatroler(creep);
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
            case 'chemist':
                smartCreep =  new CreepChemist(creep);
                break;
        }

        if (!smartCreep) {
            smartCreep = new CreepBase(creep);
        }

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