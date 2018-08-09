'use strict';

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
        if (room.IsVisible) {
            room.analyze(false);
            room.tickReservations();
            room.prepare();
            room.defend();
            room.linking();
        }
    }

    for (let roomName in Game.rooms) {
        let room = Game.rooms[roomName];

        let creeps = empire.getCreeps(roomName);

        if (creeps.miners) {
            //console.log(roomName + " has " + creeps.miners.length + " miners.");
        }
    
        if (room.name === "E77N86") {
            let homeRoom = "E77N85";
            let workRoom = room.name;

            let spawnName = "Moss";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {
                let roomPop = pop[workRoom];

                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, workRoom);
                }

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.memory.jobs.settlers) {
                    let res = empire.createCreep("settler", null, spawnName, "LLMM", homeRoom, workRoom);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 3) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCCCCCCMMMMMMMMMMMMMMMM", homeRoom, workRoom);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.memory.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCMMM", homeRoom, workRoom);
                }
            }
        }

        if (room.name === "E77N85") {
            let homeRoom = room.name;
            let workRoom = room.name;
            
            let spawnName = "Stavanger";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {
                let roomPop = pop[workRoom];

                if ((!roomPop.balancers ? 0 : roomPop.balancers.length) < 0) {
                    let res = empire.createCreep("balancer", null, spawnName, "CCCCCCCCCCCCCCCCMMMMMMMMWM", homeRoom, workRoom);
                }

                if ((!roomPop.mineralminers ? 0 : roomPop.mineralminers.length) < room.memory.jobs.mineralminers) {
                    let res = empire.createCreep("mineralminer", null, spawnName, "WWWWWWWWWWCCMMMMM", homeRoom, workRoom);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = empire.createCreep("builder", null, spawnName, "WWCCCCMMM", homeRoom, workRoom);
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 2) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WWWWWWWWWWWWWWWCMMMMMMMM", homeRoom, workRoom);
                }

                if ((!roomPop.healers ? 0 : roomPop.healers.length) < 0) {
                    let res = empire.createCreep("healer", null, spawnName, "TTTTTMMMMMHMHMHMHM", homeRoom, workRoom);
                }

                if ((!roomPop.defenders ? 0 : roomPop.defenders.length) < 0) {
                    let res = empire.createCreep("defender", null, spawnName, "TTTTTTTTTTMMMMMMMMMMRMRMRMRMRM", homeRoom, workRoom);
                }

                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 0) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, workRoom);
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let res = empire.createCreep("broker", null, spawnName, "CCCCCCCCM", homeRoom, workRoom);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCCCCCCCCCMMMMMM", homeRoom, workRoom);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < 1 ) { //room.memory.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWWWWWWWWWWCCCMMMMMMMMM", homeRoom, workRoom);
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.memory.jobs.refuelers) {
                    let res = empire.createCreep("refueler", null, spawnName, "CCCCCCCCCCMMMMM", homeRoom, workRoom);
                }
            }
        }

        if (room.name === "E77N87") {
            let homeRoom = "E77N88";
            let workRoom = room.name;
            
            let spawnName = "Askim";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {
                let roomPop = pop[workRoom];

                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, workRoom);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 2) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCMMMMM", homeRoom, workRoom);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < 1) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWCMMMM", homeRoom, workRoom);
                }
            }
        }

        if (room.name === "E78N87") {
            let homeRoom = "E77N88";
            let workRoom = room.name;
            
            let spawnName = "Askim";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {
                let roomPop = pop[workRoom];
                
                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, workRoom);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 2) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCMMMMM", homeRoom, workRoom);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < 1) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWCMMMM", homeRoom, workRoom);
                }
            }
        }

        if (room.name === "E77N88") {
            let homeRoom = room.name;
            let workRoom = room.name;
            
            let spawnName = "Askim";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {
                let roomPop = pop[workRoom];
                
                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, workRoom);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 0) {
                    let res = empire.createCreep("builder", null, spawnName, "WWWWWWWWWWCCCCCCCCCCMMMMMMMMMMMMMMMMMMMM", homeRoom, workRoom);
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 2) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WWWWWWWWWWCCCCCCCCCCMMMMMMMMMMMMMMMMMMMM", homeRoom, workRoom);
                }
            }
        }

        if (room.name === "E78N89") {
            let homeRoom = "E77N88";
            let workRoom = room.name;
            
            let spawnName = "Huske";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {
                let roomPop = pop[workRoom];
                
                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, workRoom);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 2) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCMMMM", homeRoom, workRoom);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < 1) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWCCMMM", homeRoom, workRoom);
                }
            }
        }

        if (room.name === "E77N89") {
            let homeRoom = "E77N88";
            let workRoom = room.name;
            
            let spawnName = "Huske";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {
                let roomPop = pop[workRoom];
                
                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, workRoom);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 0) {
                    let res = empire.createCreep("builder", null, spawnName, "WCCCMM", homeRoom, workRoom);
                }

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.memory.jobs.settlers) {
                    let res = empire.createCreep("settler", null, spawnName, "LLMM", homeRoom, workRoom);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCMMMMM", homeRoom, workRoom);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < 1) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCCMMM", homeRoom, workRoom);
                }
            }
        }

        if (room.name === "E77N88") {
            let homeRoom = room.name;
            let workRoom = room.name;
            
            let spawnName = "Huske";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {
                let roomPop = pop[workRoom];
                
                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 0) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WCCMMM", homeRoom, workRoom);
                }
                
                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = empire.createCreep("builder", null, spawnName, "WWCCCMMMM", homeRoom, workRoom);
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 0) {
                    let res = empire.createCreep("broker", null, spawnName, "CCCCCCCCM", homeRoom, workRoom);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCCCMMM", homeRoom, workRoom);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.memory.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWCMMM", homeRoom, workRoom);
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.memory.jobs.refuelers) {
                    let res = empire.createCreep("refueler", null, spawnName, "CCCCMM", homeRoom, workRoom);
                }
            }
        }

        if (room.name === "E78N85") {
            let homeRoom = room.name;
            let workRoom = room.name;
            
            let spawnName = "Bergen";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {
                let roomPop = pop[workRoom];

                if ((!roomPop.balancers ? 0 : roomPop.balancers.length) < 0) {
                    let res = empire.createCreep("balancer", null, spawnName, "CCCCCCCCCCCCCCCCMMMMMMMM", homeRoom, workRoom);
                }

                if ((!roomPop.mineralminers ? 0 : roomPop.mineralminers.length) < room.memory.jobs.mineralminers) {
                    let res = empire.createCreep("mineralminer", null, spawnName, "WWWWWWWWWWWWWWWCCCMMMMMMMMM", homeRoom, workRoom);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = empire.createCreep("builder", null, spawnName, "WCM", homeRoom, workRoom);
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 1) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WCM", homeRoom, workRoom);
                }

                if ((!roomPop.healers ? 0 : roomPop.healers.length) < 0) {
                    let res = empire.createCreep("healer", null, spawnName, "TTTTTMMMMMHMHMHMHM", homeRoom, workRoom);
                }

                if ((!roomPop.defenders ? 0 : roomPop.defenders.length) < 0) {
                    let res = empire.createCreep("defender", null, spawnName, "TTTTTMMMMMRMRMRMRMRM", homeRoom, workRoom);
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let res = empire.createCreep("broker", null, spawnName, "CCCCCCCCM", homeRoom, workRoom);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < room.memory.jobs.haulers) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCMM", homeRoom, workRoom);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < 1 ) { //room.memory.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWWWWWWWWWWCCCMMMMMMMMM", homeRoom, workRoom);
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.memory.jobs.refuelers) {
                    let res = empire.createCreep("refueler", null, spawnName, "CCCCCCCCMMMM", homeRoom, workRoom);
                }
            }
        }
        
        if (room.name === "E78N86") {
            let homeRoom = "E79N86";
            let workRoom = room.name;
            
            let spawnName = "Rygge";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {
                let roomPop = pop[workRoom];
                
                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, workRoom);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 0) {
                    let res = empire.createCreep("builder", null, spawnName, "WCCMMM", homeRoom, workRoom);
                }

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.memory.jobs.settlers) {
                    let res = empire.createCreep("settler", null, spawnName, "LLMM", homeRoom, workRoom);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 2) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCCCCCMMMMMMM", homeRoom, workRoom);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.memory.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWCMMM", homeRoom, workRoom);
                }
            }
        }
        
        if (room.name === "E79N86") {
            let homeRoom = room.name;
            let workRoom = room.name;
            
            let spawnName = "Rygge";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {
                let roomPop = pop[workRoom];

                if ((!roomPop.mineralminers ? 0 : roomPop.mineralminers.length) < room.memory.jobs.mineralminers) {
                    let res = empire.createCreep("mineralminer", null, spawnName, "WWWWWWWWWWWWWWWCCCMMMMMMMMM", homeRoom, workRoom);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = empire.createCreep("builder", null, spawnName, "WWCCCCCCCCMMMMM", homeRoom, workRoom);
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 2) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WWWWWWWWWWWWWWWCCCMMMMMMMMM", homeRoom, workRoom);
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let res = empire.createCreep("broker", null, spawnName, "CCCCCCCCM", homeRoom, workRoom);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCCCCCCCCCMMMMMM", homeRoom, workRoom);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.memory.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCCMMM", homeRoom, workRoom);
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.memory.jobs.refuelers) {
                    let res = empire.createCreep("refueler", null, spawnName, "CCCCCCCCMMMM", homeRoom, workRoom);
                }
            }
        }
        
        if (room.name === "E80N85") {
            let homeRoom = "E79N85";
            let workRoom = room.name;
            
            let spawnName = "Larvik";
            let roomSpawn = Game.spawns[spawnName];
            
            if (roomSpawn && !roomSpawn.spawning) {
                let roomPop = pop[workRoom];

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = empire.createCreep("builder", null, spawnName, "WCMM", homeRoom, workRoom);
                }
            }
        }

        if (room.name === "E79N84") {
            let homeRoom = "E79N85";
            let workRoom = room.name;
            
            let spawnName = "Larvik";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {
                let roomPop = pop[workRoom];

                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, workRoom);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 0) {
                    let res = empire.createCreep("builder", null, spawnName, "WWCCCCCCCCMMMMMMMMMM", homeRoom, workRoom);
                }

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.memory.jobs.settlers) {
                    let res = empire.createCreep("settler", null, spawnName, "LLMM", homeRoom, workRoom);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 3) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMMMMM", homeRoom, workRoom);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.memory.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCMMMMMM", homeRoom, workRoom);
                }
            }
        }

        if (room.name === "E79N85") {
            let homeRoom = room.name;
            let workRoom = room.name;
            
            let spawnName = "Oslo";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {
                let roomPop = pop[workRoom];

                if ((!roomPop.balancers ? 0 : roomPop.balancers.length) < 0) {
                    let res = empire.createCreep("balancer", null, spawnName, "CCCCCCCCCCCCCCCCMMMMMMMM", homeRoom, workRoom);
                }

                if ((!roomPop.mineralminers ? 0 : roomPop.mineralminers.length) < room.memory.jobs.mineralminers) {
                    let res = empire.createCreep("mineralminer", null, spawnName, "WWWWWWWWWWWWWWWCCCMMMMMMMMM", homeRoom, workRoom);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = empire.createCreep("builder", null, spawnName, "WCCCCCMMM", homeRoom, workRoom);
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 1) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WWWWWWWWWWWWWWWCMMMMMMMM", homeRoom, workRoom);
                }

                if ((!roomPop.healers ? 0 : roomPop.healers.length) < 0) {
                    let res = empire.createCreep("healer", null, spawnName, "TTTTTMMMMMHMHMHMHM", homeRoom, workRoom);
                }

                if ((!roomPop.defenders ? 0 : roomPop.defenders.length) < 0) {
                    let res = empire.createCreep("defender", null, spawnName, "TTTTTMMMMMRMRMRMRMRM", homeRoom, workRoom);
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let res = empire.createCreep("broker", null, spawnName, "CCCCCCCCM", homeRoom, workRoom);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, workRoom);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < 1) { //room.memory.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWWWWWWWWWWCCCMMMMMMMMM", homeRoom, workRoom);
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.memory.jobs.refuelers) {
                    let res = empire.createCreep("refueler", null, spawnName, "CCCCCCCCMMMM", homeRoom, workRoom);
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