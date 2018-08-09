'use strict';

let code = require('code');

let Empire = require('Empire');

let RoomBase = require('Room.Base');
let RoomReal = require('Room.Real');

let Population = require('Population');
let CreepFactory = require('CreepFactory');

module.exports.loop = function () {
    // Ensure that the hive is up to date with what the code expects.
    code.update();

    let empire = new Empire();
    global.Empire = empire;
    
    empire.arrange();

    // Build up a structure with creeps organized in rooms and jobs.
    let pop = new Population();
    pop.populate();

    let knownRooms = {};
    for (let roomName in Game.rooms) {
        knownRooms[roomName] = new RoomReal(Game.rooms[roomName]);
        knownRooms[roomName].update();
    }
    for (let roomName in Memory.rooms) {
        if (!knownRooms[roomName]) {
            knownRooms[roomName] = new RoomBase(roomName);
            knownRooms[roomName].update();
        }
    }
    for (let roomName in pop) {
        if (!knownRooms[roomName]) {
            knownRooms[roomName] = new RoomBase(roomName);
            knownRooms[roomName].update();
        }
    }

    let creepFactory = new CreepFactory(knownRooms);
    for (let creepName in Game.creeps) {
        let smartCreep = creepFactory.wrap(Game.creeps[creepName]);
        if (smartCreep.act()) {
            continue;
        }
    }

    for (let roomName in Game.rooms) {
        let room = Game.rooms[roomName];
        
        if (room.name === "E77N86") {
            let homeRoom = "E77N85";
            let workRoom = room.name;
            let roomSpawn = Game.spawns.Moss;
            
            if (roomSpawn && !roomSpawn.spawning) {
                let roomPop = pop[workRoom];

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 1) {
                    let body = creepFactory.buildBody("WCM");
                    let res = roomSpawn.createCreep(body, null, { job: "upgrader", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let body = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE];
                    let res = roomSpawn.createCreep(body, null, { job: "attacker", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 0) {
                    let body = creepFactory.buildBody("WWCCCCMMMMMM");
                    let res = roomSpawn.createCreep(body, null, { job: "builder", rooms: { home: homeRoom, work: workRoom } });
                }

                //if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.memory.jobs.settlers) {
                //    let body = creepFactory.buildBody("LLMM");
                //    let res = roomSpawn.createCreep(body, null, { job: "settler", rooms: { home: homeRoom, work: workRoom } });
                //}
                
                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 3) {
                    let body = creepFactory.buildBody("WCCCCCCCCCCCCCCMMMMMMMMMMMMMMMM");
                    let res = roomSpawn.createCreep(body, null, { job: "hauler", rooms: { home: homeRoom, work: workRoom } });
                }
                
                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.memory.jobs.miners) {
                    let body = creepFactory.buildBody("WWWWWCMMMMM");
                    let res = roomSpawn.createCreep(body, null, { job: "miner", rooms: { home: homeRoom, work: workRoom } });
                }
            }
        }

        if (room.name === "E77N85") {
            let homeRoom = room.name;
            let workRoom = room.name;
            let roomSpawn = Game.spawns.Stavanger;
            
            if (roomSpawn && !roomSpawn.spawning) {
                let roomPop = pop[workRoom];

                if ((!roomPop.balancers ? 0 : roomPop.balancers.length) < 0) {
                    let body = creepFactory.buildBody("CCCCCCCCCCCCCCCCMMMMMMMMWM");
                    let res = roomSpawn.createCreep(body, null, { job: "balancer", rooms: { home: "E78N85", work: workRoom } });
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let body = [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
                    let res = roomSpawn.createCreep(body, null, { job: "builder", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 1) {
                    let body = creepFactory.buildBody("WWWWWWWWWWWWWWWCMMMMMMMM");
                    let res = roomSpawn.createCreep(body, null, { job: "upgrader", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.healers ? 0 : roomPop.healers.length) < 0) {
                    let body = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE];
                    let res = roomSpawn.createCreep(body, null, { job: "healer", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.defenders ? 0 : roomPop.defenders.length) < 0) {
                    let body = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE];
                    let res = roomSpawn.createCreep(body, null, { job: "defender", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 0) {
                    let body = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE];
                    let res = roomSpawn.createCreep(body, null, { job: "attacker", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let body = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE];
                    let res = roomSpawn.createCreep(body, null, { job: "broker", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 2) {
                    let body = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                    let res = roomSpawn.createCreep(body, null, { job: "hauler", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.memory.jobs.miners) {
                    let body = [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE];
                    let res = roomSpawn.createCreep(body, null, { job: "miner", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.memory.jobs.refuelers) {
                    let body = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE];
                    let res = roomSpawn.createCreep(body, null, { job: "refueler", rooms: { home: homeRoom, work: workRoom } });
                }
            }
        }

        if (room.name === "E78N85") {
            let homeRoom = room.name;
            let workRoom = room.name;
            let roomSpawn = Game.spawns.Bergen;
            
            if (roomSpawn && !roomSpawn.spawning) {
                let roomPop = pop[workRoom];

                if ((!roomPop.balancers ? 0 : roomPop.balancers.length) < 0) {
                    let body = creepFactory.buildBody("CCCCCCCCCCCCCCCCMMMMMMMM");
                    let res = roomSpawn.createCreep(body, null, { job: "balancer", rooms: { home: "E77N85", work: workRoom } });
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let body = [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                    let res = roomSpawn.createCreep(body, null, { job: "builder", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 1) {
                    let body = creepFactory.buildBody("WWWWWWWWWWWWWWWCMMMMMMMM");
                    let res = roomSpawn.createCreep(body, null, { job: "upgrader", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.healers ? 0 : roomPop.healers.length) < 0) {
                    let body = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE];
                    let res = roomSpawn.createCreep(body, null, { job: "healer", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.defenders ? 0 : roomPop.defenders.length) < 0) {
                    let body = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE];
                    let res = roomSpawn.createCreep(body, null, { job: "defender", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let body = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE];
                    let res = roomSpawn.createCreep(body, null, { job: "broker", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let body = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                    let res = roomSpawn.createCreep(body, null, { job: "hauler", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.memory.jobs.miners) {
                    let body = [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE];
                    let res = roomSpawn.createCreep(body, null, { job: "miner", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.memory.jobs.refuelers) {
                    let body = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
                    let res = roomSpawn.createCreep(body, null, { job: "refueler", rooms: { home: homeRoom, work: workRoom } });
                }
            }
        }
        
        if (room.name === "E79N86") {
            let homeRoom = room.name;
            let workRoom = room.name;
            let roomSpawn = Game.spawns.Rygge;
            
            if (roomSpawn && !roomSpawn.spawning) {
                let roomPop = pop[workRoom];

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 0) {
                    let body = creepFactory.buildBody("WCCMM");
                    let res = roomSpawn.createCreep(body, null, { job: "builder", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 0) {
                    let body = creepFactory.buildBody("WWWWWWWWWWCCCCCCCCCCMMMMMMMMMMMMMMMMMMMM");
                    let res = roomSpawn.createCreep(body, null, { job: "upgrader", rooms: { home: homeRoom, work: workRoom } });
                }
                
                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 0) {
                    let body = creepFactory.buildBody("CCCMMM");
                    let res = roomSpawn.createCreep(body, null, { job: "hauler", rooms: { home: homeRoom, work: workRoom } });
                }
                
                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.memory.jobs.miners) {
                    let body = creepFactory.buildBody("WWWWWCMMM");
                    let res = roomSpawn.createCreep(body, null, { job: "miner", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.memory.jobs.refuelers) {
                    let body = creepFactory.buildBody("CCCCCCCCMMMM");
                    let res = roomSpawn.createCreep(body, null, { job: "refueler", rooms: { home: homeRoom, work: workRoom } });
                }
            }
        }
        
        if (room.name === "E79N86") {
            let homeRoom = room.name;
            let workRoom = room.name;
            let roomSpawn = Game.spawns.Askim;
            
            if (roomSpawn && !roomSpawn.spawning) {
                let roomPop = pop[workRoom];

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let body = creepFactory.buildBody("WWWWWWWWWWCCCCCCCCCCMMMMMMMMMMMMMMMMMMMM");
                    let res = roomSpawn.createCreep(body, null, { job: "builder", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 2) {
                    let body = creepFactory.buildBody("WWWWWWWWWWCCCCCCCCCCMMMMMMMMMMMMMMMMMMMM");
                    let res = roomSpawn.createCreep(body, null, { job: "upgrader", rooms: { home: homeRoom, work: workRoom } });
                }
                
                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let body = creepFactory.buildBody("CCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMMMMWM");
                    let res = roomSpawn.createCreep(body, null, { job: "hauler", rooms: { home: homeRoom, work: workRoom } });
                }
            }
        }
        
        if (room.name === "E79N84") {
            let homeRoom = "E79N85";
            let workRoom = room.name;
            let roomSpawn = Game.spawns.Larvik;
            
            if (roomSpawn && !roomSpawn.spawning) {
                let roomPop = pop[workRoom];

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 0) {
                    let body = creepFactory.buildBody("WWCCCCCCCCMMMMMMMMMM");
                    let res = roomSpawn.createCreep(body, null, { job: "builder", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 0) {
                    let body = creepFactory.buildBody("WWWWWWWWWWCCCCCCCCCCMMMMMMMMMMMMMMMMMMMM");
                    let res = roomSpawn.createCreep(body, null, { job: "upgrader", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.memory.jobs.settlers) {
                    let body = creepFactory.buildBody("LLMM");
                    let res = roomSpawn.createCreep(body, null, { job: "settler", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 3) {
                    let body = creepFactory.buildBody("CCCCCCCCCCCCCCCCCCCCMMMMMMMMMMMMMMMMMMMMWM");
                    let res = roomSpawn.createCreep(body, null, { job: "hauler", rooms: { home: homeRoom, work: workRoom } });
                }
                
                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.memory.jobs.miners) {
                    let body = creepFactory.buildBody("WWWWWWCMMMMMM");
                    let res = roomSpawn.createCreep(body, null, { job: "miner", rooms: { home: homeRoom, work: workRoom } });
                }
            }
        }
        
        if (room.name === "E79N85") {
            let homeRoom = room.name;
            let workRoom = room.name;
            let roomSpawn = Game.spawns.Oslo;
            
            if (roomSpawn && !roomSpawn.spawning) {
                let roomPop = pop[workRoom];

                if ((!roomPop.balancers ? 0 : roomPop.balancers.length) < 1) {
                    let body = creepFactory.buildBody("CCCCCCCCCCCCCCCCCCCCMMMMMMMMMMWM");
                    let res = roomSpawn.createCreep(body, null, { job: "balancer", rooms: { home: "E79N86", work: workRoom } });
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let body = [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
                    let res = roomSpawn.createCreep(body, null, { job: "builder", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 1) {
                    let body = creepFactory.buildBody("WWWWWWWWWWWWWWWCMMMMMMMM");
                    let res = roomSpawn.createCreep(body, null, { job: "upgrader", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.healers ? 0 : roomPop.healers.length) < 0) {
                    let body = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE];
                    let res = roomSpawn.createCreep(body, null, { job: "healer", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.defenders ? 0 : roomPop.defenders.length) < 0) {
                    let body = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE];
                    let res = roomSpawn.createCreep(body, null, { job: "defender", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let body = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE];
                    let res = roomSpawn.createCreep(body, null, { job: "attacker", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let body = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE];
                    let res = roomSpawn.createCreep(body, null, { job: "broker", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let body = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                    let res = roomSpawn.createCreep(body, null, { job: "hauler", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.memory.jobs.miners) {
                    let body = [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE];
                    let res = roomSpawn.createCreep(body, null, { job: "miner", rooms: { home: homeRoom, work: workRoom } });
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.memory.jobs.refuelers) {
                    let body = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
                    let res = roomSpawn.createCreep(body, null, { job: "refueler", rooms: { home: homeRoom, work: workRoom } });
                }
            }
        }

        let roomTowers = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });

        for (let tower of roomTowers) {

            let damagedCreeps = tower.room.find(FIND_MY_CREEPS, {
                filter: (creep) => {
                    return creep.hits < creep.hitsMax;
                }
            });

            if (damagedCreeps.length > 0) {
                tower.heal(damagedCreeps[0]);
                continue;
            }

            let hostiles = tower.room.find(FIND_HOSTILE_CREEPS);
            let hostileCreep = tower.pos.findClosestByRange(hostiles);

            // TODO: Check for body parts that are hostile
            if (hostileCreep !== null && hostileCreep.pos.y < 49) {
                tower.attack(hostileCreep);
                continue;
            }

            if (tower.energy < tower.energyCapacity - 200) {
                continue;
            }

            let rampartToRepair = tower.pos.findClosestByRange(FIND_STRUCTURES, { 
                filter: (s) => { 
                    return s.structureType === STRUCTURE_RAMPART && (s.hits < 250000);
                } 
            });
            
            if (rampartToRepair !== null) {
                tower.repair(rampartToRepair);
                continue;
            }

            let wallToRepair = tower.pos.findClosestByRange(FIND_STRUCTURES, { 
                filter: (wall) => { 
                    return wall.structureType === STRUCTURE_WALL && (wall.hits < 250000);
                } 
            });
            
            if (wallToRepair !== null) {
                tower.repair(wallToRepair);
                continue;
            } 
                    
            let containerToRepair = tower.pos.findClosestByPath(FIND_STRUCTURES, { 
                filter: function (s) { 
                    return s.structureType === STRUCTURE_CONTAINER && (s.hits < s.hitsMax); 
                } 
            });
            
            if (containerToRepair !== null) {
                tower.repair(containerToRepair);
                continue;
            } 
                    
            let roadToRepair = tower.pos.findClosestByPath(FIND_STRUCTURES, { 
                filter: function (road) { 
                    return road.structureType === STRUCTURE_ROAD && (road.hits < road.hitsMax); 
                } 
            });

            if (roadToRepair !== null) {
                tower.repair(roadToRepair);
                continue;
            }
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

}