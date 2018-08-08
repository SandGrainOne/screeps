'use strict';

let code = require('code');

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

    // Update rooms
    for (let roomName in Game.rooms) {
        let smartRoom = roomFactory.wrap(Game.rooms[roomName]);
        if (smartRoom.update()) {
            continue;
        }
    }

    // Let all creeps perform their actions.
    for (let creepName in Game.creeps) {
        let smartCreep = creepFactory.wrap(Game.creeps[creepName]);
        if (smartCreep.act()) {
            continue;
        }
    }

    for (let roomName in Game.rooms) {
        let room = Game.rooms[roomName];
        let smartRoom = roomFactory.wrap(Game.rooms[roomName]);

        if (room.name === "W4N79") {
            let homeRoom = "W3N79";
            let roomSpawn = Game.rooms[homeRoom].find(FIND_MY_SPAWNS)[0];

            if (!roomSpawn.spawning && Game.rooms[homeRoom].energyAvailable >= 1200) {
                let roomPop = pop[room.name];

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.memory.jobs.settlers) {
                    roomSpawn.createCreep([CLAIM, CLAIM, MOVE, MOVE], null, { job: "settler", remoteroom: room.name, homeroom: homeRoom });
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 2) {
                    roomSpawn.createCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, { job: "builder", remoteroom: room.name, homeroom: homeRoom });
                }           

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 2) {
                    roomSpawn.createCreep([WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, { job: "hauler", remoteroom: room.name, homeroom: homeRoom });
                }
                
                if ((!roomPop.miners ? 0 : roomPop.miners.length) < 2) {
                    roomSpawn.createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, { job: "miner", remoteroom: room.name, homeroom: homeRoom });
                }

                if ((!roomPop.soldiers ? 0 : roomPop.soldiers.length) < 1) {
                    roomSpawn.createCreep([TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, { job: "soldier", remoteroom: room.name, homeroom: homeRoom });
                }
            }
        }

        if (room.name === "W5N78") {
            let homeRoom = "W4N78";
            let roomSpawn = Game.rooms[homeRoom].find(FIND_MY_SPAWNS)[0];

            if (!roomSpawn.spawning && Game.rooms[homeRoom].energyAvailable >= 1200) {
                let roomPop = pop[room.name];

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.memory.jobs.settlers) {
                    roomSpawn.createCreep([CLAIM, CLAIM, MOVE, MOVE], null, { job: "settler", remoteroom: room.name, homeroom: homeRoom });
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    roomSpawn.createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], null, { job: "builder", remoteroom: room.name, homeroom: homeRoom });
                }            

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 1) {
                    roomSpawn.createCreep([WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, { job: "hauler", remoteroom: room.name, homeroom: homeRoom });
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < 1) {
                    roomSpawn.createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], null, { job: "miner", remoteroom: room.name, homeroom: homeRoom });
                }
            }
        }

        if (room.name === "ERROR") { //W5N79
            let homeRoom = "W4N78";
            let roomSpawn = Game.rooms[homeRoom].find(FIND_MY_SPAWNS)[0];

            if (!roomSpawn.spawning && Game.rooms[homeRoom].energyAvailable >= 1200) {
                let roomPop = pop[room.name];

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.memory.jobs.settlers) {
                    roomSpawn.createCreep([CLAIM, CLAIM, MOVE, MOVE], null, { job: "settler", remoteroom: room.name, homeroom: homeRoom });
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    roomSpawn.createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], null, { job: "builder", remoteroom: room.name, homeroom: homeRoom });
                }            

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 0) {
                    roomSpawn.createCreep([WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, { job: "hauler", remoteroom: room.name, homeroom: homeRoom });
                }

                if ((!roomPop.miners ? 0 : roomPop.miners.length) < 2) {
                    roomSpawn.createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, { job: "miner", remoteroom: room.name, homeroom: homeRoom });
                }
            }
        }
        
        if (room.name === "W4N78") {
            let roomSpawn = room.find(FIND_MY_SPAWNS)[0];
            
            if (!roomSpawn.spawning && room.energyAvailable >= 1000) {
                let roomPop = pop[room.name];
                
                if ((!roomPop.soldiers ? 0 : roomPop.soldiers.length) < 0) {
                    roomSpawn.createCreep([RANGED_ATTACK, RANGED_ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE], null, { job: "soldier", remoteroom: room.name, homeroom: room.name });
                }
                
                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 4) {
                    roomSpawn.createCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], null, { job: "builder", remoteroom: room.name, homeroom: room.name });
                }
                
                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 2) {
                    roomSpawn.createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], null, { job: "upgrader", remoteroom: room.name, homeroom: room.name });
                }

                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < 1) {
                    roomSpawn.createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], null, { job: "refueler", remoteroom: room.name, homeroom: room.name });
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    roomSpawn.createCreep([CARRY, CARRY, CARRY, CARRY, MOVE], null, { job: "broker", remoteroom: room.name, homeroom: room.name });
                }

                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 3) {
                    roomSpawn.createCreep([WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, { job: "hauler", remoteroom: room.name, homeroom: room.name });
                }
                
                if ((!roomPop.miners ? 0 : roomPop.miners.length) < 2) {
                    roomSpawn.createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, MOVE], null, { job: "miner", remoteroom: room.name, homeroom: room.name });
                }
                
                if ((!roomPop.defenders ? 0 : roomPop.defenders.length) < 2) {
                    roomSpawn.createCreep([TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE], null, { job: "defender", remoteroom: room.name, homeroom: room.name });
                }
            }
        }

        if (room.name === "W3N78") {
            let homeRoom = "W3N79";
            let roomSpawn = Game.rooms[homeRoom].find(FIND_MY_SPAWNS)[0];

            if (!roomSpawn.spawning && Game.rooms[homeRoom].energyAvailable >= 1200) {
                let roomPop = pop[room.name];

                if ((!roomPop.settlers ? 0 : roomPop.settlers.length) < room.memory.jobs.settlers) {
                    roomSpawn.createCreep([CLAIM, CLAIM, MOVE, MOVE], null, { job: "settler", remoteroom: room.name, homeroom: homeRoom });
                }

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 1) {
                    roomSpawn.createCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, { job: "builder", remoteroom: room.name, homeroom: homeRoom });
                }
                
                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 2) {
                    // TODO: Remember hack to redistribute energy to room under attack.
                    roomSpawn.createCreep([WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, { job: "hauler", remoteroom: room.name, homeroom: "W4N78" });
                }
                
                if ((!roomPop.miners ? 0 : roomPop.miners.length) < 2) {
                    roomSpawn.createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, { job: "miner", remoteroom: room.name, homeroom: homeRoom });
                }

                if ((!roomPop.soldiers ? 0 : roomPop.soldiers.length) < 1) {
                    roomSpawn.createCreep([TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, { job: "soldier", remoteroom: room.name, homeroom: homeRoom });
                }
            }
        }

        if (room.name === "W3N79") {
            let roomSpawn = room.find(FIND_MY_SPAWNS)[0];
            
            if (!roomSpawn.spawning && room.energyAvailable >= 1200) {
                let roomPop = pop[room.name];

                if ((!roomPop.builders ? 0 : roomPop.builders.length) < 2) {
                    roomSpawn.createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], null, { job: "builder", remoteroom: room.name, homeroom: room.name });
                }
                
                if ((!roomPop.upgraders ? 0 : roomPop.upgraders.length) < 3) {
                    roomSpawn.createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], null, { job: "upgrader", remoteroom: room.name, homeroom: room.name });
                }
                
                if ((!roomPop.refuelers ? 0 : roomPop.refuelers.length) < 1) {
                    roomSpawn.createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], null, { job: "refueler", remoteroom: room.name, homeroom: room.name });
                }

                if ((!roomPop.brokers ? 0 : roomPop.brokers.length) < 1) {
                    roomSpawn.createCreep([CARRY, CARRY, CARRY, CARRY, MOVE], null, { job: "broker", remoteroom: room.name, homeroom: room.name });
                }
                
                if ((!roomPop.haulers ? 0 : roomPop.haulers.length) < 3) {
                    roomSpawn.createCreep([WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, { job: "hauler", remoteroom: room.name, homeroom: room.name });
                }
                
                if ((!roomPop.miners ? 0 : roomPop.miners.length) < 2) {
                    roomSpawn.createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, MOVE], null, { job: "miner", remoteroom: room.name, homeroom: room.name });
                }
                
                if ((!roomPop.defenders ? 0 : roomPop.defenders.length) < 0) {
                    roomSpawn.createCreep([TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE], null, { job: "defender", remoteroom: room.name, homeroom: room.name });
                }
            }
        }

        let roomTowers = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });

        for (let tower of roomTowers) {

            let damagedCreeps = tower.room.find(FIND_MY_CREEPS, {
                filter: (creep) => {
                    return creep.hits < creep.hitsMax / 3;
                }
            });
    
            if (damagedCreeps.length > 0) {
                tower.heal(damagedCreeps[0]);
                continue;
            }

            let hostiles = tower.room.find(FIND_HOSTILE_CREEPS);

            let hostileCreep = tower.pos.findClosestByRange(hostiles);

            // TODO: Check for body parts that are hostile
            if (hostileCreep !== null) {
                tower.attack(hostileCreep);
                continue;
            }

            if (tower.energy < tower.energyCapacity - 200) {
                continue;
            }

            let rampartToRepair = tower.pos.findClosestByRange(FIND_STRUCTURES, { 
                filter: (s) => { 
                    return s.structureType === STRUCTURE_RAMPART && (s.hits < 150000); 
                } 
            });
            
            if (rampartToRepair !== null) {
                tower.repair(rampartToRepair);
                continue;
            }

            let wallToRepair = tower.pos.findClosestByRange(FIND_STRUCTURES, { 
                filter: (wall) => { 
                    return wall.structureType === STRUCTURE_WALL && (wall.hits < 150000);
                } 
            });
            
            if (wallToRepair !== null) {
                tower.repair(wallToRepair);
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
    
    let fromLink = Game.getObjectById("5881dc05a16b3f06786208a0");
    let toLink = Game.getObjectById("5881fb2f3576026d0798a98e");

    if (fromLink && !fromLink.cooldown && toLink) {
        if (fromLink.energy > 100 && toLink.energy < toLink.energyCapacity / 2) {
            let result = fromLink.transferEnergy(toLink, Math.min(fromLink.energy, toLink.energyCapacity - toLink.energy - 10));
        }
    }
    
    fromLink = Game.getObjectById("588388a734b81a2122e0321b");
    toLink = Game.getObjectById("5881fb2f3576026d0798a98e");

    if (fromLink && !fromLink.cooldown && toLink) {
        if (fromLink.energy > 100 && toLink.energy < toLink.energyCapacity / 2) {
            let result = fromLink.transferEnergy(toLink, Math.min(fromLink.energy, toLink.energyCapacity - toLink.energy - 10));
        }
    }
    
    fromLink = Game.getObjectById("5881b20f931682da3fe38ae8");
    toLink = Game.getObjectById("58815321f42d3c4c5cb3ca63");

    if (fromLink && !fromLink.cooldown && toLink) {
        if (fromLink.energy > 100 && toLink.energy < toLink.energyCapacity / 2) {
            let result = fromLink.transferEnergy(toLink, Math.min(fromLink.energy, toLink.energyCapacity - toLink.energy - 10));
        }
    }
}