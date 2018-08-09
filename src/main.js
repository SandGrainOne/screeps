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
                    let body = creepFactory.buildBody("TTTTTMMMMMAMAMAMAMAM");
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, workRoom);
                    //let res = roomSpawn.createCreep(body, null, { job: "attacker", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.memory.jobs.settlers) {
                    let body = creepFactory.buildBody("LLMM");
                    let res = empire.createCreep("settler", null, spawnName, "LLMM", homeRoom, workRoom);
                    //let res = roomSpawn.createCreep(body, null, { job: "settler", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 3) {
                    let body = creepFactory.buildBody("WCCCCCCCCCCCCCCMMMMMMMMMMMMMMMM");
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCCCCCCMMMMMMMMMMMMMMMM", homeRoom, workRoom);
                    //let res = roomSpawn.createCreep(body, null, { job: "hauler", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.memory.jobs.miners) {
                    let body = creepFactory.buildBody("WWWWWCMMM");
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWCMMM", homeRoom, workRoom);
                    //let res = roomSpawn.createCreep(body, null, { job: "miner", rooms: { home: homeRoom, work: workRoom } });
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
                    //let body = creepFactory.buildBody("CCCCCCCCCCCCCCCCMMMMMMMMWM");
                    //let res = roomSpawn.createCreep(body, null, { job: "balancer", rooms: { home: "E78N85", work: workRoom } });
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = empire.createCreep("builder", null, spawnName, "WWCCCCMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WWCCCCMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "builder", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 2) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WWWWWWWWWWWWWWWCMMMMMMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WWWWWWWWWWWWWWWCMMMMMMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "upgrader", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.healers ? 0 : roomPop.healers.length) < 0) {
                    let res = empire.createCreep("healer", null, spawnName, "TTTTTMMMMMHMHMHMHM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("TTTTTMMMMMHMHMHMHM");
                    //let res = roomSpawn.createCreep(body, null, { job: "healer", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.defenders ? 0 : roomPop.defenders.length) < 0) {
                    let res = empire.createCreep("defender", null, spawnName, "TTTTTTTTTTMMMMMMMMMMRMRMRMRMRM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("TTTTTTTTTTMMMMMMMMMMRMRMRMRMRM");
                    //let res = roomSpawn.createCreep(body, null, { job: "defender", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 0) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("TTTTTMMMMMAMAMAMAMAM");
                    //let res = roomSpawn.createCreep(body, null, { job: "attacker", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let res = empire.createCreep("broker", null, spawnName, "CCCCCCCCM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("CCCCCCCCM");
                    //let res = roomSpawn.createCreep(body, null, { job: "broker", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 2) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCCCCCCCMMMMMMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WCCCCCCCCCCCCCCCMMMMMMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "hauler", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.memory.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWCMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WWWWWCMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "miner", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.memory.jobs.refuelers) {
                    let res = empire.createCreep("refueler", null, spawnName, "CCCCCCCCCCMMMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("CCCCCCCCCCMMMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "refueler", rooms: { home: homeRoom, work: workRoom } });
                }
            }
        }

        if (room.name === "E77N89") {
            let homeRoom = "E77N88";
            let workRoom = room.name;
            
            let spawnName = "Askim";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {
                let roomPop = pop[workRoom];
                
                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("TTTTTMMMMMAMAMAMAMAM");
                    //let res = roomSpawn.createCreep(body, null, { job: "attacker", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 2) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCMMMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WCCCCCCCCCMMMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "hauler", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < 1) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWCMMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WWWCMMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "miner", rooms: { home: homeRoom, work: workRoom } });
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
                    //let body = creepFactory.buildBody("TTTTTMMMMMAMAMAMAMAM");
                    //let res = roomSpawn.createCreep(body, null, { job: "attacker", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 2) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCMMMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WCCCCCCCCCMMMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "hauler", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < 1) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWCMMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WWWCMMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "miner", rooms: { home: homeRoom, work: workRoom } });
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
                    //let body = creepFactory.buildBody("TTTTTMMMMMAMAMAMAMAM");
                    //let res = roomSpawn.createCreep(body, null, { job: "attacker", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 2) {
                    let res = empire.createCreep("builder", null, spawnName, "WWWWWWWWWWCCCCCCCCCCMMMMMMMMMMMMMMMMMMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WWWWWWWWWWCCCCCCCCCCMMMMMMMMMMMMMMMMMMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "builder", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 0) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WWWWWWWWWWCCCCCCCCCCMMMMMMMMMMMMMMMMMMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WWWWWWWWWWCCCCCCCCCCMMMMMMMMMMMMMMMMMMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "upgrader", rooms: { home: homeRoom, work: workRoom } });
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
                    let res = empire.createCreep("attacker", null, spawnName, "AM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("AM");
                    //let res = roomSpawn.createCreep(body, null, { job: "attacker", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < 2) {
                    let res = empire.createCreep("miner", null, spawnName, "WCCMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WCCMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "miner", rooms: { home: homeRoom, work: workRoom } });
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
                
                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = empire.createCreep("builder", null, spawnName, "WCCMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WCCMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "builder", rooms: { home: homeRoom, work: workRoom } });
                }
            }
        }

        if (room.name === "E77N87") {
            let homeRoom = "E77N88";
            let workRoom = room.name;
            
            let spawnName = "Huske";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {
                let roomPop = pop[workRoom];
                
                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = empire.createCreep("builder", null, spawnName, "WCCMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WCCMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "builder", rooms: { home: homeRoom, work: workRoom } });
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
                
                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 1) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WCCMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WCCMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "upgrader", rooms: { home: homeRoom, work: workRoom } });
                }
                
                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 0) {
                    let res = empire.createCreep("builder", null, spawnName, "WCCMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WCCMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "builder", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCCCMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("CCCCCCMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "hauler", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.memory.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWCMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WWWWWCMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "miner", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.memory.jobs.refuelers) {
                    let res = empire.createCreep("refueler", null, spawnName, "CCCCMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("CCCCMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "refueler", rooms: { home: homeRoom, work: workRoom } });
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
                    //let body = creepFactory.buildBody("CCCCCCCCCCCCCCCCMMMMMMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "balancer", rooms: { home: "E79N85", work: workRoom } });
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = empire.createCreep("builder", null, spawnName, "WCM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WCM");
                    //let res = roomSpawn.createCreep(body, null, { job: "builder", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 1) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WCM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WCM");
                    //let res = roomSpawn.createCreep(body, null, { job: "upgrader", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.healers ? 0 : roomPop.healers.length) < 0) {
                    let res = empire.createCreep("healer", null, spawnName, "TTTTTMMMMMHMHMHMHM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("TTTTTMMMMMHMHMHMHM");
                    //let res = roomSpawn.createCreep(body, null, { job: "healer", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.defenders ? 0 : roomPop.defenders.length) < 0) {
                    let res = empire.createCreep("defender", null, spawnName, "TTTTTMMMMMRMRMRMRMRM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("TTTTTMMMMMRMRMRMRMRM");
                    //let res = roomSpawn.createCreep(body, null, { job: "defender", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let res = empire.createCreep("broker", null, spawnName, "CCCCCCCCM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("CCCCCCCCM");
                    //let res = roomSpawn.createCreep(body, null, { job: "broker", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCCCCCCCMMMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("CCCCCCCCCCMMMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "hauler", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.memory.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWCMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WWWWWCMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "miner", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.memory.jobs.refuelers) {
                    let res = empire.createCreep("refueler", null, spawnName, "CCCCCCCCMMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("CCCCCCCCMMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "refueler", rooms: { home: homeRoom, work: workRoom } });
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
                    //let body = creepFactory.buildBody("TTTTTMMMMMAMAMAMAMAM");
                    //let res = roomSpawn.createCreep(body, null, { job: "attacker", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 0) {
                    let res = empire.createCreep("builder", null, spawnName, "WCCMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WCCMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "builder", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.memory.jobs.settlers) {
                    let res = empire.createCreep("settler", null, spawnName, "LLMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("LLMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "settler", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 2) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCMMMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WCCCCCCCCCMMMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "hauler", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.memory.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWCMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WWWWWCMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "miner", rooms: { home: homeRoom, work: workRoom } });
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

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = empire.createCreep("builder", null, spawnName, "WWCCCCCCCCMMMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WWCCCCCCCCMMMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "builder", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 1) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WWWWWWWWWWCMMMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WWWWWWWWWWCMMMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "upgrader", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let res = empire.createCreep("broker", null, spawnName, "CCCCCCCCM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("CCCCCCCCM");
                    //let res = roomSpawn.createCreep(body, null, { job: "broker", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCCCCCCCCCMMMMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("CCCCCCCCCCCCMMMMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "hauler", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.memory.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWCMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WWWWWCMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "miner", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.memory.jobs.refuelers) {
                    let res = empire.createCreep("refueler", null, spawnName, "CCCCCCCCMMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("CCCCCCCCMMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "refueler", rooms: { home: homeRoom, work: workRoom } });
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
                    //let body = creepFactory.buildBody("WCMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "builder", rooms: { home: homeRoom, work: workRoom } });
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
                    //let body = creepFactory.buildBody("TTTTTMMMMMAMAMAMAMAM");
                    //let res = roomSpawn.createCreep(body, null, { job: "attacker", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 0) {
                    let res = empire.createCreep("builder", null, spawnName, "WWCCCCCCCCMMMMMMMMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WWCCCCCCCCMMMMMMMMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "builder", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.memory.jobs.settlers) {
                    let res = empire.createCreep("settler", null, spawnName, "LLMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("LLMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "settler", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 3) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMMMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMMMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "hauler", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.memory.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCMMMMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WWWWWWCMMMMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "miner", rooms: { home: homeRoom, work: workRoom } });
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
                    //let body = creepFactory.buildBody("CCCCCCCCCCCCCCCCMMMMMMMM"); // 800 fits in a Link.
                    //let res = roomSpawn.createCreep(body, null, { job: "balancer", rooms: { home: "E78N85", work: workRoom } });
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = empire.createCreep("builder", null, spawnName, "WCCCCCMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WCCCCCMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "builder", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 1) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WWWWWWWWWWWWWWWCMMMMMMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WWWWWWWWWWWWWWWCMMMMMMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "upgrader", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.healers ? 0 : roomPop.healers.length) < 0) {
                    let res = empire.createCreep("healer", null, spawnName, "TTTTTMMMMMHMHMHMHM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("TTTTTMMMMMHMHMHMHM");
                    //let res = roomSpawn.createCreep(body, null, { job: "healer", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.defenders ? 0 : roomPop.defenders.length) < 0) {
                    let res = empire.createCreep("defender", null, spawnName, "TTTTTMMMMMRMRMRMRMRM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("TTTTTMMMMMRMRMRMRMRM");
                    //let res = roomSpawn.createCreep(body, null, { job: "defender", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let res = empire.createCreep("broker", null, spawnName, "CCCCCCCCM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("CCCCCCCCM");
                    //let res = roomSpawn.createCreep(body, null, { job: "broker", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "hauler", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.memory.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWCMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("WWWWWCMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "miner", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.memory.jobs.refuelers) {
                    let res = empire.createCreep("refueler", null, spawnName, "CCCCCCCCMMMM", homeRoom, workRoom);
                    //let body = creepFactory.buildBody("CCCCCCCCMMMM");
                    //let res = roomSpawn.createCreep(body, null, { job: "refueler", rooms: { home: homeRoom, work: workRoom } });
                }
            }
        }
    }

    for (let creep of empire.AllCreeps) {
        if (creep.act()) {
            continue;
        }
    }

    let fromLink = Game.getObjectById("5897cb82f074eac46eeb087f");
    let toLink = Game.getObjectById("589d95f9063cc27e37648007");

    if (fromLink && !fromLink.cooldown && toLink) {
        if (fromLink.energy > 100 && toLink.energy < toLink.energyCapacity / 2) {
            let result = fromLink.transferEnergy(toLink, Math.min(fromLink.energy, toLink.energyCapacity - toLink.energy));
        }
    }

    fromLink = Game.getObjectById("589a4b4fff0e700f15aaa76d");
    toLink = Game.getObjectById("589a431371b628f71a4292d7");

    if (fromLink && !fromLink.cooldown && toLink) {
        if (fromLink.energy > 100 && toLink.energy < toLink.energyCapacity / 2) {
            let result = fromLink.transferEnergy(toLink, Math.min(fromLink.energy, toLink.energyCapacity - toLink.energy));
        }
    }

    fromLink = Game.getObjectById("58a82d5c41af22461a2d48f1");
    toLink = Game.getObjectById("58a60d21b73b6a3dedee4dec");

    if (fromLink && !fromLink.cooldown && toLink) {
        if (fromLink.energy > 100 && toLink.energy < toLink.energyCapacity / 2) {
            let result = fromLink.transferEnergy(toLink, Math.min(fromLink.energy, toLink.energyCapacity - toLink.energy));
        }
    }

    fromLink = Game.getObjectById("58b83e84b390cb1a93e25209");
    toLink = Game.getObjectById("58a60d21b73b6a3dedee4dec");

    if (fromLink && !fromLink.cooldown && toLink) {
        if (fromLink.energy > 100 && toLink.energy < toLink.energyCapacity / 2) {
            let result = fromLink.transferEnergy(toLink, Math.min(fromLink.energy, toLink.energyCapacity - toLink.energy));
        }
    }

    fromLink = Game.getObjectById("58ae28a20bcb7a605ea55704");
    toLink = Game.getObjectById("589d95f9063cc27e37648007");

    if (fromLink && !fromLink.cooldown && toLink) {
        if (fromLink.energy > 100 && toLink.energy < toLink.energyCapacity / 2) {
            let result = fromLink.transferEnergy(toLink, Math.min(fromLink.energy, toLink.energyCapacity - toLink.energy));
        }
    }

    fromLink = Game.getObjectById("58b5206fafc1cf314b4929d4");
    toLink = Game.getObjectById("589d95f9063cc27e37648007");

    if (fromLink && !fromLink.cooldown && toLink) {
        if (fromLink.energy > 100 && toLink.energy < toLink.energyCapacity / 2) {
            let result = fromLink.transferEnergy(toLink, Math.min(fromLink.energy, toLink.energyCapacity - toLink.energy));
        }
    }

    fromLink = Game.getObjectById("58b71b04b8a048a430803fa2");
    toLink = Game.getObjectById("58a15c24e86fa64666de8b75");

    if (fromLink && !fromLink.cooldown && toLink) {
        if (fromLink.energy > 100 && toLink.energy < toLink.energyCapacity / 2) {
            let result = fromLink.transferEnergy(toLink, Math.min(fromLink.energy, toLink.energyCapacity - toLink.energy));
        }
    }

    fromLink = Game.getObjectById("58c861f0e83aa1995e0d98da");
    toLink = Game.getObjectById("58c795f0fef13ac779ffdb47");

    if (fromLink && !fromLink.cooldown && toLink) {
        if (fromLink.energy > 100 && toLink.energy < toLink.energyCapacity / 2) {
            let result = fromLink.transferEnergy(toLink, Math.min(fromLink.energy, toLink.energyCapacity - toLink.energy));
        }
    }
}