'use strict';

require("prototype.creep");

let C = require('constants');
let code = require('code');

let Empire = require('Empire');

module.exports.loop = function () {
    // Ensure that the hive is up to date with what the code expects.
    code.update();

    let empire = new Empire();
    global.Empire = empire;

    empire.prepare();
    empire.balanceEnergy();

    for (let room of empire.rooms) {
        if (room.isVisible) {
            // Analyse the room structures, organize them and make jobs.
            room.analyze(false);

            // Prepare the room for the current tick.
            room.prepare();

            // Let the towers do their thing
            room.defend();

            // Increase the TTL of all reservations and remove those that expired.
            room.tickReservations();

            // Run links in the room. Bring energy to the controller and storage
            room.linking();

            // Run reactions on all labs in the room.
            room.runReactions();
        }

        // TEMPORARY To be done as a step during analysis.
        room.createJobs();

        let rule = null;

        if (room.name === "sim") {
            rule = {
                "spawnName": "Spawn1",
                "homeRoom": room.name,
                "jobs": {
                    "miner": { "count": room.jobs.miners, "body": "WCMM" }
                }
            };
        }

        if (room.name === "E73N87") {
            rule = {
                "queue": true,
                "spawnName": "Grimstad",
                "homeRoom": room.name,
                "jobs": {
                    "refueler": { "count": room.jobs.refuelers, "body": "CCCCMM", "priority": C.SPAWN_PRIORITY_HIGH },
                    "linker": { "count": 1, "body": "CCCCCCCCMMMM" },
                    "miner": { "count": room.jobs.miners, "body": "WWWWWWCCMMMM" },
                    "hauler": { "count": 3, "body": "CCCCCCCCCCMMMMM" },
                    "builder": { "count": 2, "body": "WWWCCMMM" },
                    "upgrader": { "count": 4, "body": "WWWWWCCCCCCCCCCCMMMMMMMM" },
                    "attacker": { "count": 1, "body": "TTTTAAMMMMM" }
                }
            };
        }

        if (room.name === "E75N86") {
            rule = {
                "spawnName": "Mandal",
                "homeRoom": "E75N87",
                "jobs": {
                    "builder": { "count": 1, "body": "WWWWWWCCCCCCCCCCCCCCMMMMMMMMMM" },
                    "hauler": { "count": 3, "body": "WCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMMMMMMMMM" },
                    "miner": { "count": room.jobs.miners, "body": "WWWWWWWCCCMMMMM" },
                    "patroler": { "count": 1, "body": "MMMMMMMMMMMMMMMMMMMMMMMMRRRRRRRRRRRRRRRRRRRRMHHHHH" }
                }
            };
        }

        if (room.name === "E74N89") {
            rule = {
                "spawnName": "Lillesand",
                "homeRoom": "E75N89",
                "jobs": {
                    "settler": { "count": room.jobs.settlers, "body": "LLMM" },
                    "attacker": { "count": 1, "body": "TTTTTMMMMMAMAMAMAMAM" },
                    "hauler": { "count": 3, "body": "WCCCCCCCCCCCCCMMMMMMM" },
                    "miner": { "count": room.jobs.miners, "body": "WWWWWWCCMMMM" }
                }
            };
        }

        if (room.name === "E76N89") {
            rule = {
                "spawnName": "Lillesand",
                "homeRoom": "E75N89",
                "jobs": {
                    "settler": { "count": room.jobs.settlers, "body": "LLMM" },
                    "attacker": { "count": 1, "body": "TTTTTMMMMMAMAMAMAMAM" },
                    "hauler": { "count": 2, "body": "WCCCCCCCCCCCCCMMMMMMM" },
                    "miner": { "count": room.jobs.miners, "body": "WWWWWWCCMMMM" }
                }
            };
        }
        
        if (room.name === "E75N89") {
            rule = {
                "spawnName": "Kopervik",
                "homeRoom": room.name,
                "jobs": {
                    "chemist": { "count": 1, "body": "CCCCMM" },
                    "mineralminer": { "count": room.jobs.mineralminers, "body": "WWWWWWWCCMMMMMMM" },
                    "attacker": { "count": 1, "body": "TTTTTTTTTTMMMMMMMMMMAMAMAMAMAMAMAMAMAMAM" },
                    "linker": { "count": 1, "body": "CCCCCCCCCCCCCCCCMMMM" },
                    "broker": { "count": 1, "body": "CCCCM" },
                    "upgrader": { "count": 3, "body": "WWWWWWWWWWCCCCCCCMMMMMMMMM" },
                    "builder": { "count": 2, "body": "WWWWWCCCCCCCMMMMMM" },
                    "hauler": { "count": 2, "body": "CCCCCCCCCCMMMMM" },
                    "miner": { "count": room.jobs.miners, "body": "WWWWWWCCMMMM" },
                    "refueler": { "count": room.jobs.refuelers, "body": "CCCCCCMMM" }
                }
            };
        }

        let roomPop = empire.getCreeps(room.name);

        if (rule) {
            let spawn = Game.spawns[rule.spawnName];

            if (!spawn || spawn.spawning) {
                continue;
            }

            for (let job in rule.jobs) {
                if ((!roomPop[job + "s"] ? 0 : roomPop[job + "s"].length) < rule.jobs[job].count) {
                    if (rule.queue) {
                        room.queueCreep({ "job": job , "body": rule.jobs[job].body, "workRoom": room.name });
                    }
                    else {
                        empire.createCreep(job, null, rule.spawnName, rule.jobs[job].body, rule.homeRoom, room.name);
                    }
                }
            }
        }

        if (room.name === "E79N88") {
            let homeRoom = "E78N88";

            let spawnName = "Farsund";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 2) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWCMMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E78N88") {
            let homeRoom = "E78N88";

            let spawnName = "Narvik";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {
                
                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, room.name);
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 2) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WWWWWWCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = empire.createCreep("builder", null, spawnName, "WWWWWWCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCCCCCMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCCMMMM", homeRoom, room.name);
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.jobs.refuelers) {
                    let res = empire.createCreep("refueler", null, spawnName, "CCCCMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E75N88") {
            let homeRoom = "E75N87";

            let spawnName = "Oppdal";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {
                
                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, room.name);
                }

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.jobs.settlers) {
                    let res = empire.createCreep("settler", null, spawnName, "LLMM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCCMMMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E76N87") {
            let homeRoom = "E75N87";

            let spawnName = "Oppdal";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {
                
                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, room.name);
                }

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.jobs.settlers) {
                    let res = empire.createCreep("settler", null, spawnName, "LLMM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWCCMMMMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E75N87") {
            let homeRoom = room.name;

            let spawnName = "Veum";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.chemists ? 0 : roomPop.chemists.length) < 1) {
                    let res = empire.createCreep("chemist", null, spawnName, "CCCCMM", homeRoom, room.name);
                }

                if ((!roomPop.mineralminers ? 0 : roomPop.mineralminers.length) < room.jobs.mineralminers) {
                    let res = empire.createCreep("mineralminer", null, spawnName, "WWWWWWWCCMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, room.name);
                }

                if ((!roomPop.linkers ? 0 : roomPop.linkers.length) < 1) {
                    let res = empire.createCreep("linker", null, spawnName, "CCCCCCCCCCCCCCCCMMMM", homeRoom, room.name);
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let res = empire.createCreep("broker", null, spawnName, "CCCCM", homeRoom, room.name);
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 1) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WWWWWWWWWWWWWWWCCCCCCMMMMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 2) {
                    let res = empire.createCreep("builder", null, spawnName, "WWWWWWCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 2) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCCMMMM", homeRoom, room.name);
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.jobs.refuelers) {
                    let res = empire.createCreep("refueler", null, spawnName, "CCCCCCCCCCMMMMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E76N85") {
            let homeRoom = "E77N85";

            let spawnName = "Kirkenes";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.mineralminers ? 0 : roomPop.mineralminers.length) < room.jobs.mineralminers) {
                    let res = empire.createCreep("mineralminer", null, spawnName, "WWWWWWWCCMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = empire.createCreep("builder", null, spawnName, "WWWWWWCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 2) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.patrolers ? 0 : roomPop.patrolers.length) < 1) {
                    let res = empire.createCreep("patroler", null, spawnName, "MMMMMMMMMMMMMMMMMMMMMMMMRRRRRRRRRRRRRRRRRRRRMHHHHH", homeRoom, room.name)
                }
            }
        }

        if (room.name === "E75N85") {
            let homeRoom = "E77N85";

            let spawnName = "Molde";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.mineralminers ? 0 : roomPop.mineralminers.length) < room.jobs.mineralminers) {
                    let res = empire.createCreep("mineralminer", null, spawnName, "WWWWWWWCCCMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 2) {
                    let res = empire.createCreep("builder", null, spawnName, "WWWWWCCCCCCCMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 4) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWWCCCMMMMM", homeRoom, room.name);
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
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCCMMMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E77N85") {
            let homeRoom = room.name;

            let spawnName = "Stavanger";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.chemists ? 0 : roomPop.chemists.length) < 1) {
                    let res = empire.createCreep("chemist", null, spawnName, "CCCCMM", homeRoom, room.name);
                }

                if ((!roomPop.balancers ? 0 : roomPop.balancers.length) < 0) {
                    let res = empire.createCreep("balancer", null, spawnName, "CCCCCCCCCCCCCCCCMMMMMMMMWM", homeRoom, room.name);
                }

                if ((!roomPop.mineralminers ? 0 : roomPop.mineralminers.length) < room.jobs.mineralminers) {
                    let res = empire.createCreep("mineralminer", null, spawnName, "WWWWWWWWWWCCMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 2) {
                    let res = empire.createCreep("builder", null, spawnName, "WWWWWCCCCCCCMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 1) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WWWWWWWWWWWWWWWCCCCCCMMMMMMMMMMMMM", homeRoom, room.name);
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

                if ((!roomPop.linkers ? 0 : roomPop.linkers.length) < 1) {
                    let res = empire.createCreep("linker", null, spawnName, "CCCCCCCCCCCCCCCCMMMM", homeRoom, room.name);
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let res = empire.createCreep("broker", null, spawnName, "CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 2) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCCMMMM", homeRoom, room.name);
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.jobs.refuelers) {
                    let res = empire.createCreep("refueler", null, spawnName, "CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E77N87") {
            let homeRoom = "E77N88";

            let spawnName = "Bryne";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.jobs.settlers) {
                    let res = empire.createCreep("settler", null, spawnName, "LLMM", homeRoom, room.name);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = empire.createCreep("builder", null, spawnName, "WWCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 2) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCCMMMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E78N87") {
            let homeRoom = "E77N88";

            let spawnName = "Bryne";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.jobs.settlers) {
                    let res = empire.createCreep("settler", null, spawnName, "LLMM", homeRoom, room.name);
                }

                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 2) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCCCCCCCCCCCCCWMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCCMMMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E78N89") {
            let homeRoom = "E77N88";

            let spawnName = "Horten";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, room.name);
                }

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.jobs.settlers) {
                    let res = empire.createCreep("settler", null, spawnName, "LLMM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 2) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCCCMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCCMMMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E77N89") {
            let homeRoom = "E77N88";

            let spawnName = "Horten";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, room.name);
                }

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.jobs.settlers) {
                    let res = empire.createCreep("settler", null, spawnName, "LLMM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCCMMMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E77N88") {
            let homeRoom = room.name;

            let spawnName = "Huske";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.chemists ? 0 : roomPop.chemists.length) < 1) {
                    let res = empire.createCreep("chemist", null, spawnName, "CCM", homeRoom, room.name);
                }

                if ((!roomPop.mineralminers ? 0 : roomPop.mineralminers.length) < room.jobs.mineralminers) {
                    let res = empire.createCreep("mineralminer", null, spawnName, "WWWWWWWWWWWWWWWCCCMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 1) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WWWWWWWWWWWWWWWCCCCCCMMMMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 2) {
                    let res = empire.createCreep("builder", null, spawnName, "WWWWWCCCCCCCMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.linkers ? 0 : roomPop.linkers.length) < 1) {
                    let res = empire.createCreep("linker", null, spawnName, "CCCCCCCCCCCCCCCCMMMM", homeRoom, room.name);
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let res = empire.createCreep("broker", null, spawnName, "CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCCMMMM", homeRoom, room.name);
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.jobs.refuelers) {
                    let res = empire.createCreep("refueler", null, spawnName, "CCCCCCCCCCCCCCCCMMMMMMMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E78N85") {
            let homeRoom = room.name;

            let spawnName = "Bergen";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.chemists ? 0 : roomPop.chemists.length) < 1) {
                    let res = empire.createCreep("chemist", null, spawnName, "CCCCMM", homeRoom, room.name);
                }

                if ((!roomPop.balancers ? 0 : roomPop.balancers.length) < 0) {
                    let res = empire.createCreep("balancer", null, spawnName, "CCCCCCCCCCCCCCCCMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.mineralminers ? 0 : roomPop.mineralminers.length) < room.jobs.mineralminers) {
                    let res = empire.createCreep("mineralminer", null, spawnName, "WWWWWWWWWWWWWWWCCCMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 2) {
                    let res = empire.createCreep("builder", null, spawnName, "WWWWWCCCCCCCMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 1) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WWWWWWWWWWWWWWWCCCCCCMMMMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.healers ? 0 : roomPop.healers.length) < 0) {
                    let res = empire.createCreep("healer", null, spawnName, "TTTTTMMMMMHMHMHMHM", homeRoom, room.name);
                }

                if ((!roomPop.defenders ? 0 : roomPop.defenders.length) < 0) {
                    let res = empire.createCreep("defender", null, spawnName, "TTTTTMMMMMRMRMRMRMRM", homeRoom, room.name);
                }

                if ((!roomPop.linkers ? 0 : roomPop.linkers.length) < 1) {
                    let res = empire.createCreep("linker", null, spawnName, "CCCCCCCCCCCCCCCCMMMM", homeRoom, room.name);
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let res = empire.createCreep("broker", null, spawnName, "CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {//room.jobs.haulers) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCCMMMM", homeRoom, room.name);
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

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCCCCCCCCCMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCCMMMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E79N86") {
            let homeRoom = room.name;

            let spawnName = "Rygge";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.chemists ? 0 : roomPop.chemists.length) < 1) {
                    let res = empire.createCreep("chemist", null, spawnName, "CCCCMM", homeRoom, room.name);
                }

                if ((!roomPop.mineralminers ? 0 : roomPop.mineralminers.length) < room.jobs.mineralminers) {
                    let res = empire.createCreep("mineralminer", null, spawnName, "WWWWWWWWWWWWWWWWWWWWCCCCMMMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 2) {
                    let res = empire.createCreep("builder", null, spawnName, "WWWWWCCCCCCCMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 1) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WWWWWWWWWWWWWWWCCCCCCMMMMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.linkers ? 0 : roomPop.linkers.length) < 1) {
                    let res = empire.createCreep("linker", null, spawnName, "CCCCCCCCCCCCCCCCMMMM", homeRoom, room.name);
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let res = empire.createCreep("broker", null, spawnName, "CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1){//room.jobs.haulers) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCCMMMM", homeRoom, room.name);
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.jobs.refuelers) {
                    let res = empire.createCreep("refueler", null, spawnName, "CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E80N85") {
            let homeRoom = "E79N85";

            let spawnName = "Larvik";
            let roomSpawn = Game.spawns[spawnName];
            
            if (roomSpawn && !roomSpawn.spawning) {
                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = empire.createCreep("builder", null, spawnName, "WWWCCCCCCMMMMMMMMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E79N84") {
            let homeRoom = "E79N85";

            let spawnName = "Elverum";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.jobs.settlers) {
                    let res = empire.createCreep("settler", null, spawnName, "LLMM", homeRoom, room.name);
                }

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.jobs.settlers) {
                    let res = empire.createCreep("settler", null, spawnName, "LLMM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 3) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCCMMMM", homeRoom, room.name);
                }

                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 2) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E79N85") {
            let homeRoom = room.name;

            let spawnName = "Oslo";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.chemists ? 0 : roomPop.chemists.length) < 1) {
                    let res = empire.createCreep("chemist", null, spawnName, "CCCCCCMMM", homeRoom, room.name);
                }

                if ((!roomPop.balancers ? 0 : roomPop.balancers.length) < 0) {
                    let res = empire.createCreep("balancer", null, spawnName, "CCCCCCCCCCCCCCCCMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.mineralminers ? 0 : roomPop.mineralminers.length) < room.jobs.mineralminers) {
                    let res = empire.createCreep("mineralminer", null, spawnName, "WWWWWWWWWWWWWWWWWWWWCCCCCCMMMMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = empire.createCreep("builder", null, spawnName, "WWWWWCCCCCCCMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 1) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WWWWWWWWWWWWWWWCCCCCCMMMMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.healers ? 0 : roomPop.healers.length) < 0) {
                    let res = empire.createCreep("healer", null, spawnName, "TTTTTMMMMMHMHMHMHM", homeRoom, room.name);
                }

                if ((!roomPop.defenders ? 0 : roomPop.defenders.length) < 0) {
                    let res = empire.createCreep("defender", null, spawnName, "TTTTTMMMMMRMRMRMRMRM", homeRoom, room.name);
                }

                if ((!roomPop.linkers ? 0 : roomPop.linkers.length) < 1) {
                    let res = empire.createCreep("linker", null, spawnName, "CCCCCCCCCCCCCCCCMMMM", homeRoom, room.name);
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let res = empire.createCreep("broker", null, spawnName, "CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCCMMMM", homeRoom, room.name);
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.jobs.refuelers) {
                    let res = empire.createCreep("refueler", null, spawnName, "CCCCCCCCMMMM", homeRoom, room.name);
                }
            }
        }

        if (room.isMine) {
            room.performSpawning();
        }
    }

    for (let creep of empire.creeps) {
        if (creep.act()) {
            continue;
        }
    }
}