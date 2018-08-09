'use strict';

let code = require('code');

let RoomBase = require('Room.Base');
let RoomBaseV2 = require('Room.BaseV2');

let Population = require('Population');
let CreepFactory = require('CreepFactory');
let RoomFactory = require('RoomFactory');

module.exports.loop = function () {
    // Ensure that the hive is up to date with what the code expects.
    code.update();
    
    let pop = new Population();
    let creepFactory = new CreepFactory();
    let roomFactory = new RoomFactory();
    
    // Build up a structure with creeps organized in rooms and jobs.
    // It is important to do this before everything else.
    pop.populate();

    let knownRooms = {};
    for (let roomName in Memory.rooms) {
        let room = Game.rooms[roomName];
        if (room) {
            knownRooms[roomName] = new RoomBaseV2(room);
        }
        else {
            knownRooms[roomName] = new RoomBase(roomName);
        }
        knownRooms[roomName].update();
    }

    // Let all creeps perform their actions.
    for (let creepName in Game.creeps) {
        let smartCreep = creepFactory.wrap(Game.creeps[creepName]);
        smartCreep.Room = knownRooms[smartCreep.creep.memory.rooms.current];
        smartCreep.HomeRoom = knownRooms[smartCreep.creep.memory.rooms.home];
        smartCreep.WorkRoom = knownRooms[smartCreep.creep.memory.rooms.work];
        if (smartCreep.act()) {
            continue;
        }
    }

    for (let roomName in Game.rooms) {
        let room = Game.rooms[roomName];
        let smartRoom = roomFactory.wrap(Game.rooms[roomName]);
        
        if (room.name === "E77N85") {
            let roomSpawn = room.find(FIND_MY_SPAWNS)[0];
            
            if (roomSpawn && !roomSpawn.spawning) {
                let roomPop = pop[room.name];

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = roomSpawn.createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], null, { job: "builder" });
                }
                
                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 2) {
                    let res = roomSpawn.createCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], null, { job: "upgrader" });
                }
                
                if ((!roomPop.healers ? 0 : roomPop.healers.length) < 0) {
                    let res = roomSpawn.createCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE], null, { job: "healer" });
                }
                
                if ((!roomPop.defenders ? 0 : roomPop.defenders.length) < 0) {
                    let res = roomSpawn.createCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE], null, { job: "defender" });
                }
                
                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 0) {
                    let res = roomSpawn.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE], null, { job: "attacker" });
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 0) {
                    let res = roomSpawn.createCreep([CARRY, CARRY, MOVE], null, { job: "broker" });
                }
                
                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 3) {
                    let res = roomSpawn.createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, { job: "hauler" });
                }
                
                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.memory.jobs.miners) {
                    let res = roomSpawn.createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, MOVE], null, { job: "miner" });
                }
                
                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.memory.jobs.refuelers) {
                    let res = roomSpawn.createCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], null, { job: "refueler" });
                }
            }
        }

        if (room.name === "E78N85") {
            let roomSpawn = room.find(FIND_MY_SPAWNS)[0];
            
            if (roomSpawn && !roomSpawn.spawning) {
                let roomPop = pop[room.name];
                
                if ((!roomPop.balancers ? 0 : roomPop.balancers.length) < 1) {
                    // Balancers MUST be produced in the workroom.
                    let res = roomSpawn.createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, { job: "balancer", homeroom: "E77N85", workroom: "E78N85" });
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = roomSpawn.createCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], null, { job: "builder" });
                }
                
                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 1) {
                    let res = roomSpawn.createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, { job: "upgrader" });
                }
                
                if ((!roomPop.healers ? 0 : roomPop.healers.length) < 0) {
                    let res = roomSpawn.createCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE], null, { job: "healer" });
                }
                
                if ((!roomPop.defenders ? 0 : roomPop.defenders.length) < 0) {
                    let res = roomSpawn.createCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE], null, { job: "defender" });
                }
                
                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let res = roomSpawn.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE], null, { job: "attacker" });
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    let res = roomSpawn.createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE], null, { job: "broker" });
                }
                
                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let res = roomSpawn.createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, { job: "hauler" });
                }
                
                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.memory.jobs.miners) {
                    let res = roomSpawn.createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, MOVE], null, { job: "miner" });
                }
                
                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.memory.jobs.refuelers) {
                    let res = roomSpawn.createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], null, { job: "refueler" });
                }
            }
        }
        
        if (room.name === "E79N84") {
            let homeRoom = "E79N85";
            
            let roomSpawn = Game.rooms[homeRoom].find(FIND_MY_SPAWNS)[0];
            
            if (roomSpawn && !roomSpawn.spawning) {
                
                let roomPop = pop[room.name];

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.memory.jobs.settlers) {
                    let res = roomSpawn.createCreep([CLAIM, CLAIM, MOVE, MOVE], null, { job: "settler", homeroom: homeRoom, workroom: room.name });
                }
                
                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 3) {
                    let res = roomSpawn.createCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], null, { job: "hauler", homeroom: homeRoom, workroom: room.name });
                }
                
                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.memory.jobs.miners) {
                    let res = roomSpawn.createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], null, { job: "miner", homeroom: homeRoom, workroom: room.name });
                }
            }
        }
        
        if (room.name === "E79N85") {
            let roomSpawn = room.find(FIND_MY_SPAWNS)[0];
            
            if (roomSpawn && !roomSpawn.spawning) {
                let roomPop = pop[room.name];

                if ((!roomPop.balancers ? 0 : roomPop.balancers.length) < 1) {
                    // Balancers MUST be produced in the workroom.
                    let res = roomSpawn.createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, { job: "balancer", homeroom: "E78N85", workroom: "E79N85" });
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    let res = roomSpawn.createCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], null, { job: "builder" });
                }
                
                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 2) {
                    let res = roomSpawn.createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], null, { job: "upgrader" });
                }
                
                if ((!roomPop.healers ? 0 : roomPop.healers.length) < 0) {
                    let res = roomSpawn.createCreep([HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE], null, { job: "healer" });
                }
                
                if ((!roomPop.defenders ? 0 : roomPop.defenders.length) < 0) {
                    let res = roomSpawn.createCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE], null, { job: "defender" });
                }
                
                if ((!roomPop.attackers ? 0 : roomPop.attackers.length) < 1) {
                    let res = roomSpawn.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE], null, { job: "attacker" });
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 0) {
                    let res = roomSpawn.createCreep([CARRY, CARRY, CARRY, CARRY, MOVE], null, { job: "broker" });
                }
                
                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    let res = roomSpawn.createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], null, { job: "hauler" });
                }
                
                if ((!roomPop.miners ? 0 : roomPop.miners.length) < room.memory.jobs.miners) {
                    let res = roomSpawn.createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, MOVE], null, { job: "miner" });
                }
                
                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < room.memory.jobs.refuelers) {
                    let res = roomSpawn.createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], null, { job: "refueler" });
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
    
    fromLink = Game.getObjectById("5881b20f931682da3fe38ae8");
    toLink = Game.getObjectById("58815321f42d3c4c5cb3ca63");

    if (fromLink && !fromLink.cooldown && toLink) {
        if (fromLink.energy > 100 && toLink.energy < toLink.energyCapacity / 2) {
            let result = fromLink.transferEnergy(toLink, Math.min(fromLink.energy, toLink.energyCapacity - toLink.energy));
        }
    }
    
    for (let item of []) {
        console.log("e")
    }
}