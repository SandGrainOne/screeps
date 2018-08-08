'use strict';

let code = require('code');

let Population = require('Population');
let CreepFactory = require('CreepFactory');
let RoomManager = require('RoomManager');

module.exports.loop = function () {
    // Ensure that the hive is up to date with what the code expects.
    code.update();
    
    // Refresh population data. It is important to do this before everything else.
    let pop = new Population();
    pop.refresh();
    
    let controlledRooms = [];
    
    for (let roomName in Game.rooms) {
        if (Game.rooms[roomName].controller !== undefined && Game.rooms[roomName].controller.my) {
            controlledRooms.push(Game.rooms[roomName]);
        }
    }
    
    let creepFactory = new CreepFactory();
    let roomManager = new RoomManager();
    
    for (let room of controlledRooms) {
        let roomCreeps = room.find(FIND_MY_CREEPS);
        let roomSpawn = room.find(FIND_MY_SPAWNS)[0];
        
        if (Game.time % 10 === 0) {
            roomManager.analyze(room);
        }

        if (room.energyAvailable >= 1000 && !roomSpawn.spawning) {
            let numberOfSoldiers = Memory.population.soldiers.length;
            
            if (numberOfSoldiers < room.memory.settings.soldiers) {
                roomSpawn.createCreep([TOUGH, TOUGH, ATTACK, MOVE, MOVE], null, {role: "soldier", remoteroom: "W3N78" });
            }

            let numberOfBuilders = Memory.population.builders.length;
            
            if (numberOfBuilders < room.memory.settings.builders) {
                roomSpawn.createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], null, {role: "builder" });
            }
            
            let numberOfUpgraders = Memory.population.upgraders.length;
        
            if (numberOfUpgraders < room.memory.settings.upgraders) {
                roomSpawn.createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], null, {role: "upgrader" });
            }
            
            let numberOfHaulers = Memory.population.haulers.length;
            
            if (numberOfHaulers < room.memory.settings.haulers) {
                roomSpawn.createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, { role: "hauler" });
            }
            
            let numberOfMiners = Memory.population.miners.length;
            
            if (numberOfMiners < room.memory.settings.miners) {
                roomSpawn.createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, MOVE], null, { role: "miner" });
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

            // TODO: Check for body parts that are hostile instead of coordinates
            if (hostileCreep !== null && hostileCreep.pos.x > 0 && hostileCreep.pos.y > 0) {
                tower.attack(hostileCreep);
            }
            else {
                let damagedCreeps = tower.room.find(FIND_MY_CREEPS, {
                    filter: (creep) => {
                        return creep.hits < creep.hitsMax
                    }
                });
        
                if (damagedCreeps.length > 0) {
                    let damagedCreep = _(damagedCreeps).first();
                    
                    tower.heal(damagedCreep);
                }
                if (tower.energy >= tower.energyCapacity - 200) {
                    let rampartToRepair = tower.pos.findClosestByRange(FIND_STRUCTURES, { 
                        filter: function (struct) { 
                            return struct.structureType === STRUCTURE_RAMPART && (struct.hits < 100000); 
                        } 
                    });
                    
                    if (rampartToRepair !== null) {
                        tower.repair(rampartToRepair);
                    }
                    else {
                        if (tower.energy >= tower.energyCapacity - 200) {
                            let wallToRepair = tower.pos.findClosestByRange(FIND_STRUCTURES, { 
                                filter: function (wall) { 
                                    return wall.structureType === STRUCTURE_WALL && (wall.hits < 80000);
                                } 
                            });
                            
                            if (wallToRepair !== null) {
                                tower.repair(wallToRepair);
                            }
                        }
                    }
                }
            }
        }
    }
    
    for (let creepName in Game.creeps) {
        let creep = Game.creeps[creepName];
        
        // Add a logic layer to the creep
        let smartCreep = creepFactory.wrap(creep);
        
        if (smartCreep.act()) {
            continue;
        }
    }
}