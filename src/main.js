'use strict';

let code = require('code');

let Population = require('Population');
let CreepFactory = require('CreepFactory');
let RoomManager = require('RoomManager');

module.exports.loop = function () {
    // Ensure that the hive is up to date with what the code expects.
    code.update();
    
    let pop = new Population();
    let creepFactory = new CreepFactory();
    let roomManager = new RoomManager();
    
    // Refresh population data. It is important to do this before everything else.
    pop.refresh();
    
    // Let all creeps perform their actions.
    for (let creepName in Game.creeps) {
        let creep = Game.creeps[creepName];
        
        // Add a logic layer to the creep
        let smartCreep = creepFactory.wrap(creep);

        if (smartCreep.act()) {
            continue;
        }
    }
    
    let fromLink = Game.getObjectById("5878dd80335fb06a748e73ec");
    let toLink = Game.getObjectById("5878e5303393edb0108b660e");

    if (fromLink && toLink) {
        if (fromLink.energy >= 700 && toLink.energy <= 0) {
            fromLink.transferEnergy(toLink);
        }
    }

    for (let roomName in Game.rooms) {
        let room = Game.rooms[roomName];
        if (Game.time % 10 === 0) {
            roomManager.analyze(room);
        }
        
        let roomSpawns = room.find(FIND_MY_SPAWNS);
        if (roomSpawns.length === 0) {
            continue;
        }
        
        let roomSpawn = room.find(FIND_MY_SPAWNS)[0];
        if (room.name === "W3N79" && room.energyAvailable >= 1000 && !roomSpawn.spawning) {
            let roomPop = Memory.population[room.name];
            if (!roomPop.soldiers || roomPop.soldiers.length < 2) {
                //console.log("Soldiers from room " + room.name + ": " + roomPop.soldiers);
                roomSpawn.createCreep([ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE], null, {role: "soldier", remoteroom: "W3N78", homeroom: room.name });
            }
            
            if (!roomPop.remoteminers || roomPop.remoteminers.length < 2) {
                //console.log("RemoteMiners from room " + room.name + ": " + roomPop.remoteminers);
                roomSpawn.createCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, {role: "remoteminer", remoteroom: "W3N78", homeroom: room.name });
            }

            //if (!roomPop.remotebuilders || roomPop.remotebuilders.length < 2) {
                //console.log("RemoteBuilders from room " + room.name + ": " + roomPop.remotebuilders);
                //roomSpawn.createCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], null, {role: "remotebuilder", remoteroom: "W3N78", homeroom: room.name });
            //}

            if (!roomPop.settlers || roomPop.settlers.length < 1) {
                //console.log("Settlers from room " + room.name + ": " + roomPop.settlers);
                roomSpawn.createCreep([CLAIM, CLAIM, MOVE, MOVE, MOVE, MOVE], null, {role: "settler", remoteroom: "W3N78", homeroom: room.name });
            }

            if (!roomPop.builders || roomPop.builders.length < 2) {
                //console.log("Builders from room " + room.name + ": " + roomPop.builders);
                roomSpawn.createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], null, {role: "builder", remoteroom: room.name, homeroom: room.name });
            }
            
            if (!roomPop.upgraders || roomPop.upgraders.length < 4) {
                //console.log("Upgraders from room " + room.name + ": " + roomPop.upgraders);
                roomSpawn.createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], null, {role: "upgrader", remoteroom: room.name, homeroom: room.name });
            }
            
            if (!roomPop.haulers || roomPop.haulers.length < 3) {
                //console.log("Haulers from room " + room.name + ": " + roomPop.haulers);
                roomSpawn.createCreep([WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, { role: "hauler", remoteroom: room.name, homeroom: room.name });
            }
            
            if (!roomPop.miners || roomPop.miners.length < 2) {
                //console.log("Miners from room " + room.name + ": " + roomPop.miners);
                roomSpawn.createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, MOVE], null, { role: "miner", remoteroom: room.name, homeroom: room.name });
            }
        }
        
        if (room.name === "W4N78" && room.energyAvailable >= 600 && !roomSpawn.spawning) {
            let roomPop = Memory.population[room.name];
            
            if (!roomPop.builders || roomPop.builders.length < 2) {
                //console.log("Builders from room " + room.name + ": " + roomPop.builders);
                roomSpawn.createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], null, {role: "builder", remoteroom: room.name, homeroom: room.name });
            }
            
            if (!roomPop.upgraders || roomPop.upgraders.length < 4) {
                //console.log("Upgraders from room " + room.name + ": " + roomPop.upgraders);
                roomSpawn.createCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], null, {role: "upgrader", remoteroom: room.name, homeroom: room.name });
            }
            
            if (!roomPop.haulers || roomPop.haulers.length < 2) {
                //console.log("Haulers from room " + room.name + ": " + roomPop.haulers);
                roomSpawn.createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, { role: "hauler", remoteroom: room.name, homeroom: room.name });
            }
            
            if (!roomPop.miners || roomPop.miners.length < 2) {
                //console.log("Miners from room " + room.name + ": " + roomPop.miners);
                roomSpawn.createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, MOVE], null, { role: "miner", remoteroom: room.name, homeroom: room.name });
            }
        }

        let roomTowers = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });

        for (let tower of roomTowers) {
            let hostiles = tower.room.find(FIND_HOSTILE_CREEPS);

            if (hostiles.length > 0){
                if (hostiles.length > 1) {
                    if (!tower.room.controller.safeMode) {
                        tower.room.controller.activateSafeMode();
                    }
                }
            }

            let hostileCreep = tower.pos.findClosestByRange(hostiles);

            // TODO: Check for body parts that are hostile
            if (hostileCreep !== null) {
                tower.attack(hostileCreep);
                continue;
            }

            let damagedCreeps = tower.room.find(FIND_MY_CREEPS, {
                filter: (creep) => {
                    return creep.hits < creep.hitsMax
                }
            });
    
            if (damagedCreeps.length > 0) {
                tower.heal(damagedCreeps[0]);
                continue;
            }

            if (tower.energy < tower.energyCapacity - 200) {
                continue;
            }

            let rampartToRepair = tower.pos.findClosestByRange(FIND_STRUCTURES, { 
                filter: function (struct) { 
                    return struct.structureType === STRUCTURE_RAMPART && (struct.hits < 110000); 
                } 
            });
            
            if (rampartToRepair !== null) {
                tower.repair(rampartToRepair);
                continue;
            }

            let wallToRepair = tower.pos.findClosestByRange(FIND_STRUCTURES, { 
                filter: function (wall) { 
                    return wall.structureType === STRUCTURE_WALL && (wall.hits < 100000);
                } 
            });
            
            if (wallToRepair !== null) {
                tower.repair(wallToRepair);
                continue;
            }
        }
    }
}