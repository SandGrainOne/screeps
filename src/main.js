'use strict';

let C = require('constants');
let code = require('code');

let Empire = require('Empire');

let Population = require('Population');
let CreepFactory = require('CreepFactory');

module.exports.loop = function () {
    // Ensure that the hive is up to date with what the code expects.
    code.update();

    let empire = new Empire();
    global.Empire = empire;
    
    empire.prepare();

    // Build up a structure with creeps organized in rooms and jobs.
    let pop = new Population();
    pop.populate();

    let creepFactory = new CreepFactory();

    for (let room of empire.AllRooms) {
        if (room.isVisible) {
            room.analyze(false);
            room.prepare();
            room.tickReservations();
            room.defend();
            room.linking();
        }

        let roomPop = pop[room.name];

        room.populate();

        let creeps = empire.getCreeps(room.name);

        if (room.name === "E75N85") {
            let homeRoom = "E77N85";

            let spawnName = "Moss";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {
                //console.log(room.name + " has " + room.getJobsFor(C.JOB_MINER) + " positions for miners.");

                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 0) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, room.name);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = empire.createCreep("builder", null, spawnName, "WWCCCCMMM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 0) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCCCCCCMMMMMMMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.mineralminers ? 0 : roomPop.mineralminers.length) < room.jobs.mineralminers) {
                    let res = empire.createCreep("mineralminer", null, spawnName, "WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < 2) { //room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E77N86") {
            let homeRoom = "E77N85";

            let spawnName = "Moss";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, room.name);
                }

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.jobs.settlers) {
                    let res = empire.createCreep("settler", null, spawnName, "LLMM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 3) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCCCCCCMMMMMMMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCMMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E77N85") {
            let homeRoom = room.name;
            
            let spawnName = "Stavanger";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.balancers ? 0 : roomPop.balancers.length) < 0) {
                    let res = empire.createCreep("balancer", null, spawnName, "CCCCCCCCCCCCCCCCMMMMMMMMWM", homeRoom, room.name);
                }

                if ((!roomPop.mineralminers ? 0 : roomPop.mineralminers.length) < 0) { //room.jobs.mineralminers) {
                    let res = empire.createCreep("mineralminer", null, spawnName, "WWWWWWWWWWCCMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = empire.createCreep("builder", null, spawnName, "WWCCCCMMM", homeRoom, room.name);
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 2) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WWWWWWWWWWWWWWWCMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.healers ? 0 : roomPop.healers.length) < 0) {
                    let res = empire.createCreep("healer", null, spawnName, "TTTTTMMMMMHMHMHMHM", homeRoom, room.name);
                }

                if ((!roomPop.defenders ? 0 : roomPop.defenders.length) < 0) {
                    let res = empire.createCreep("defender", null, spawnName, "TTTTTTTTTTMMMMMMMMMMRMRMRMRMRM", homeRoom, room.name);
                }

                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 0) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, room.name);
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let res = empire.createCreep("broker", null, spawnName, "CCCCCCCCM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 2) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCCCCCCCMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCMMM", homeRoom, room.name);
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.jobs.refuelers) {
                    let res = empire.createCreep("refueler", null, spawnName, "CCCCCCCCCCMMMMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E77N87") {
            let homeRoom = "E77N88";
            
            let spawnName = "Askim";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.jobs.settlers) {
                    let res = empire.createCreep("settler", null, spawnName, "LLMM", homeRoom, room.name);
                }

                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 2) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCCMMMMMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E78N87") {
            let homeRoom = "E77N88";
            
            let spawnName = "Hamar";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.jobs.settlers) {
                    let res = empire.createCreep("settler", null, spawnName, "LLMM", homeRoom, room.name);
                }

                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 2) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < 1) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCCMMMMMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E77N88") {
            let homeRoom = room.name;

            let spawnName = "Askim";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 0) {
                    let res = empire.createCreep("builder", null, spawnName, "WWWWWWWWWWCCCCCCCCCCMMMMMMMMMMMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 2) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WWWWWWWWWWCCCCCCCCCCMMMMMMMMMMMMMMMMMMMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E78N89") {
            let homeRoom = "E77N88";
            
            let spawnName = "Huske";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, room.name);
                }

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.jobs.settlers) {
                    let res = empire.createCreep("settler", null, spawnName, "LLMM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 2) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < 1) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCCMMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E77N89") {
            let homeRoom = "E77N88";

            let spawnName = "Huske";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {
                
                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, room.name);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 0) {
                    let res = empire.createCreep("builder", null, spawnName, "WCCCMM", homeRoom, room.name);
                }

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.jobs.settlers) {
                    let res = empire.createCreep("settler", null, spawnName, "LLMM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < 1) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCCMMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E77N88") {
            let homeRoom = room.name;
            
            let spawnName = "Huske";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.mineralminers ? 0 : roomPop.mineralminers.length) < room.jobs.mineralminers) {
                    let res = empire.createCreep("mineralminer", null, spawnName, "WWWWWWWWWWWWWWWCCCMMMMMMMMM", homeRoom, room.name);
                }
                
                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 0) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WWWWCMM", homeRoom, room.name);
                }
                
                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = empire.createCreep("builder", null, spawnName, "WWCCCMMMM", homeRoom, room.name);
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let res = empire.createCreep("broker", null, spawnName, "CCCCCCCCM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCCCCCCCMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWCMMM", homeRoom, room.name);
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.jobs.refuelers) {
                    let res = empire.createCreep("refueler", null, spawnName, "CCCCMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E78N85") {
            let homeRoom = room.name;
            
            let spawnName = "Bergen";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.balancers ? 0 : roomPop.balancers.length) < 0) {
                    let res = empire.createCreep("balancer", null, spawnName, "CCCCCCCCCCCCCCCCMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.mineralminers ? 0 : roomPop.mineralminers.length) < room.jobs.mineralminers) {
                    let res = empire.createCreep("mineralminer", null, spawnName, "WWWWWWWWWWWWWWWCCCMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = empire.createCreep("builder", null, spawnName, "WCM", homeRoom, room.name);
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 1) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WCM", homeRoom, room.name);
                }

                if ((!roomPop.healers ? 0 : roomPop.healers.length) < 0) {
                    let res = empire.createCreep("healer", null, spawnName, "TTTTTMMMMMHMHMHMHM", homeRoom, room.name);
                }

                if ((!roomPop.defenders ? 0 : roomPop.defenders.length) < 0) {
                    let res = empire.createCreep("defender", null, spawnName, "TTTTTMMMMMRMRMRMRMRM", homeRoom, room.name);
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let res = empire.createCreep("broker", null, spawnName, "CCCCCCCCM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < room.jobs.haulers) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCMMM", homeRoom, room.name);
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.jobs.refuelers) {
                    let res = empire.createCreep("refueler", null, spawnName, "CCCCCCCCMMMM", homeRoom, room.name);
                }
            }
        }
        
        if (room.name === "E78N86") {
            let homeRoom = "E79N86";
            
            let spawnName = "Hamar";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.jobs.settlers) {
                    let res = empire.createCreep("settler", null, spawnName, "LLMM", homeRoom, room.name);
                }
                
                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 2) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCCCCCMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWCMMM", homeRoom, room.name);
                }
            }
        }
        
        if (room.name === "E79N86") {
            let homeRoom = room.name;
            
            let spawnName = "Rygge";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.mineralminers ? 0 : roomPop.mineralminers.length) < 0) { //room.jobs.mineralminers) {
                    let res = empire.createCreep("mineralminer", null, spawnName, "WWWWWWWWWWWWWWWCCCMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = empire.createCreep("builder", null, spawnName, "WWCCCCMMM", homeRoom, room.name);
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 1) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WCM", homeRoom, room.name);
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let res = empire.createCreep("broker", null, spawnName, "CCCCCCCCM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCCCCCCCCCMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCCMMM", homeRoom, room.name);
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.jobs.refuelers) {
                    let res = empire.createCreep("refueler", null, spawnName, "CCCCCCCCMMMM", homeRoom, room.name);
                }
            }
        }
        
        if (room.name === "E80N85") {
            let homeRoom = "E79N85";
            
            let spawnName = "Larvik";
            let roomSpawn = Game.spawns[spawnName];
            
            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = empire.createCreep("builder", null, spawnName, "WCMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E79N84") {
            let homeRoom = "E79N85";
            
            let spawnName = "Larvik";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, room.name);
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 1) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WCM", homeRoom, room.name);
                }

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.jobs.settlers) {
                    let res = empire.createCreep("settler", null, spawnName, "LLMM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 3) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCMMMMMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E79N85") {
            let homeRoom = room.name;
            
            let spawnName = "Oslo";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.balancers ? 0 : roomPop.balancers.length) < 0) {
                    let res = empire.createCreep("balancer", null, spawnName, "CCCCCCCCCCCCCCCCMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.mineralminers ? 0 : roomPop.mineralminers.length) < 0) {//room.jobs.mineralminers) {
                    let res = empire.createCreep("mineralminer", null, spawnName, "WWWWWWWWWWWWWWWCCCMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = empire.createCreep("builder", null, spawnName, "WCCCCCMMM", homeRoom, room.name);
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 1) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WWWWWWWWWWWWWWWCMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.healers ? 0 : roomPop.healers.length) < 0) {
                    let res = empire.createCreep("healer", null, spawnName, "TTTTTMMMMMHMHMHMHM", homeRoom, room.name);
                }

                if ((!roomPop.defenders ? 0 : roomPop.defenders.length) < 0) {
                    let res = empire.createCreep("defender", null, spawnName, "TTTTTMMMMMRMRMRMRMRM", homeRoom, room.name);
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let res = empire.createCreep("broker", null, spawnName, "CCCCCCCCM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCMMM", homeRoom, room.name);
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.jobs.refuelers) {
                    let res = empire.createCreep("refueler", null, spawnName, "CCCCCCCCMMMM", homeRoom, room.name);
                }
            }
        }
    }

    for (let creep of empire.AllCreeps) {
        if (creep.act()) {
            continue;
        }
    }
}