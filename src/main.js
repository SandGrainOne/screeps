'use strict';

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
            room.analyze(false);
            room.prepare();
            room.defend();
            room.tickReservations();
            room.linking();
            room.runReactions();
        }

        room.populate();

        let roomPop = empire.getCreeps(room.name);

        if (room.name === "E74N89") {
            let homeRoom = "E75N89";

            let spawnName = "Kopervik";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 2) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWCCMMMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E75N89") {
            let homeRoom = room.name;

            let spawnName = "Kopervik";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let res = empire.createCreep("broker", null, spawnName, "CCCCM", homeRoom, room.name);
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 4) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WWWWWCCCCCCCMMMMMM", homeRoom, room.name);
                }
                
                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 2) {
                    let res = empire.createCreep("builder", null, spawnName, "WWWWWCCCCCCCMMMMMM", homeRoom, room.name);
                }
                
                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 2) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCCCCCCCMMMMM", homeRoom, room.name);
                }
                
                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWCMMM", homeRoom, room.name);
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.jobs.refuelers) {
                    let res = empire.createCreep("refueler", null, spawnName, "CCCCMMMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E75N89") {
            let homeRoom = room.name;

            let spawnName = "Mandal"; // E75N87
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {
                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTTTTTTMMMMMMMMMMAMAMAMAMAMAMAMAMAMAM", homeRoom, room.name);
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
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWCCMMMMM", homeRoom, room.name);
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

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let res = empire.createCreep("broker", null, spawnName, "CCCCM", homeRoom, room.name);
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 1) {
                    let res = empire.createCreep("upgrader", null, spawnName, "WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 2) {
                    let res = empire.createCreep("builder", null, spawnName, "WWWWWWCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 2) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWCMMM", homeRoom, room.name);
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.jobs.refuelers) {
                    let res = empire.createCreep("refueler", null, spawnName, "CCCCCCCCCCMMMMM", homeRoom, room.name);
                }
            }
        }

        if (room.name === "E75N85") {
            let homeRoom = "E77N85";

            let spawnName = "Molde";
            let roomSpawn = Game.spawns[spawnName];

            if (roomSpawn && !roomSpawn.spawning) {

                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 0) {
                    let res = empire.createCreep("attacker", null, spawnName, "TTTTTMMMMMAMAMAMAMAM", homeRoom, room.name);
                }

                if ((!roomPop.mineralminers ? 0 : roomPop.mineralminers.length) < room.jobs.mineralminers) {
                    let res = empire.createCreep("mineralminer", null, spawnName, "WWWWWWWCCMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 2) {
                    let res = empire.createCreep("builder", null, spawnName, "WWWWWCCCCCCCMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 4) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWWCCMMMMMMM", homeRoom, room.name);
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
                    let res = empire.createCreep("upgrader", null, spawnName, "WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM", homeRoom, room.name);
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
                    let res = empire.createCreep("broker", null, spawnName, "CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 2) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCMMM", homeRoom, room.name);
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
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCCMMMMMM", homeRoom, room.name);
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
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCCMMMMMM", homeRoom, room.name);
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

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCCCMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCCMMM", homeRoom, room.name);
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

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = empire.createCreep("builder", null, spawnName, "WWCCMMMM", homeRoom, room.name);
                }

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.jobs.settlers) {
                    let res = empire.createCreep("settler", null, spawnName, "LLMM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let res = empire.createCreep("hauler", null, spawnName, "WCCCCCCCCCMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCCMMM", homeRoom, room.name);
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
                    let res = empire.createCreep("upgrader", null, spawnName, "WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 2) {
                    let res = empire.createCreep("builder", null, spawnName, "WWWWWCCCCCCCMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let res = empire.createCreep("broker", null, spawnName, "CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWCMMM", homeRoom, room.name);
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
                    let res = empire.createCreep("upgrader", null, spawnName, "WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.healers ? 0 : roomPop.healers.length) < 0) {
                    let res = empire.createCreep("healer", null, spawnName, "TTTTTMMMMMHMHMHMHM", homeRoom, room.name);
                }

                if ((!roomPop.defenders ? 0 : roomPop.defenders.length) < 0) {
                    let res = empire.createCreep("defender", null, spawnName, "TTTTTMMMMMRMRMRMRMRM", homeRoom, room.name);
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let res = empire.createCreep("broker", null, spawnName, "CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {//room.jobs.haulers) {
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
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWCMMM", homeRoom, room.name);
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
                    let res = empire.createCreep("upgrader", null, spawnName, "WWWWWWWWWWWWWWWCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let res = empire.createCreep("broker", null, spawnName, "CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1){//room.jobs.haulers) {
                    let res = empire.createCreep("hauler", null, spawnName, "CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.jobs.miners) {
                    let res = empire.createCreep("miner", null, spawnName, "WWWWWWCCMMM", homeRoom, room.name);
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
                    let res = empire.createCreep("upgrader", null, spawnName, "", homeRoom, room.name);
                }

                if ((!roomPop.healers ? 0 : roomPop.healers.length) < 0) {
                    let res = empire.createCreep("healer", null, spawnName, "TTTTTMMMMMHMHMHMHM", homeRoom, room.name);
                }

                if ((!roomPop.defenders ? 0 : roomPop.defenders.length) < 0) {
                    let res = empire.createCreep("defender", null, spawnName, "TTTTTMMMMMRMRMRMRMRM", homeRoom, room.name);
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let res = empire.createCreep("broker", null, spawnName, "CCCCCCCCCCCCCCCCCCCCMMMMMMMMMM", homeRoom, room.name);
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

    for (let creep of empire.creeps) {
        if (creep.act()) {
            continue;
        }
    }
}