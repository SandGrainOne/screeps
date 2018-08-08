'use strict';

let code = require('code');
let tools = require('tools');

let CreepFactory = require('CreepFactory');

let taskDelivering = require('task.delivering');
let taskHarvesting = require('task.harvesting');

module.exports.loop = function () 
{
    // Ensure that the hive is up to date with what the code expects.
    code.update();

    // Remove dead creeps from memory.
    tools.cleanMemory();
    
    let controlledRooms = [];
    
    for (let roomName in Game.rooms)
    {
        if (Game.rooms[roomName].controller !== undefined && Game.rooms[roomName].controller.my)
        {
            controlledRooms.push(Game.rooms[roomName]);
        }
    }
    
    for (let room of controlledRooms)
    {
        let roomCreeps = room.find(FIND_MY_CREEPS);
        let roomSpawn = room.find(FIND_MY_SPAWNS)[0];
        
        if (Game.time % 10 === 0)
        {
            setRoomStage(room);
            
            room.memory.settings = 
            {
                miners: 3,
                upgraders: 4,
                builders: 2,
                repairers: 1,
                curators: 1,
                haulers: 2
            };
            
            if (room.energyAvailable >= 300 && !roomSpawn.spawning)
            {
                let numberOfMiners = _(roomCreeps).filter( { memory: { role: 'miner' } } ).size();
                
                if (numberOfMiners < room.memory.settings.miners)
                {
                    roomSpawn.createCreep([WORK, WORK, CARRY, MOVE], null, { role: "miner" });
                }

                let numberOfUpgraders = _(roomCreeps).filter( { memory: { role: 'upgrader' } } ).size();
            
                if (numberOfUpgraders < room.memory.settings.upgraders)
                {
                    roomSpawn.createCreep([WORK, CARRY, MOVE, MOVE], null, {role: "upgrader" });
                }

                let numberOfBuilders = _(roomCreeps).filter( { memory: { role: 'builder' } } ).size();
                
                let numberOfConstructionSites = _(room.find(FIND_MY_CONSTRUCTION_SITES)).size();
                
                if (numberOfBuilders < room.memory.settings.builders && numberOfConstructionSites > 0)
                {
                    roomSpawn.createCreep([WORK, CARRY, MOVE, MOVE], null, {role: "builder" });
                }

                let numberOfRepairers = _(roomCreeps).filter( { memory: { role: 'repairer' } } ).size();
            
                if (numberOfRepairers < room.memory.settings.repairers)
                {
                    roomSpawn.createCreep([WORK, CARRY, MOVE, MOVE], null, { role: "repairer" });
                }

                let numberOfCurators = _(roomCreeps).filter( { memory: { role: 'curator' } } ).size();
            
                if (numberOfCurators < room.memory.settings.curators)
                {
                    roomSpawn.createCreep([CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], null, { role: "curator" });
                }

                let numberOfHaulers = _(roomCreeps).filter( { memory: { role: 'hauler' } } ).size();
                
                if (numberOfHaulers < room.memory.settings.haulers)
                {
                    roomSpawn.createCreep([CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], null, { role: "hauler" });
                }
            }
        }
        
        let roomTowers = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
    
        for (let tower of roomTowers) 
        {
            let hostileCreep = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            
            if (hostileCreep !== null)
            {
                tower.attack(hostileCreep);
            }
            else
            {
                let damagedCreeps = tower.room.find(FIND_MY_CREEPS, {
                    filter: (creep) => {
                        return creep.hits < creep.hitsMax
                    }
                });
        
                if (damagedCreeps.length > 0)
                {
                    let damagedCreep = _(damagedCreeps).first();
                    
                    tower.heal(damagedCreep);
                }
            }
        }
    }
        
    let creepFactory = new CreepFactory();
    
    for (let creepName in Game.creeps)
    {
        let creep = Game.creeps[creepName];
        
        if (creep.spawning)
        {
            continue;
        }
        
        // Add a logic layer to the creep
        let smartCreep = creepFactory.wrap(creep);
        
        if (smartCreep.act())
        {
            // The creep performed its task(s). Get next creep.
            continue;
        }
        
        if (creep.memory.role === "repairer")
        {
            if (creep.memory.task !== "repairing" && creep.memory.task !== "harvesting" )
            {
                creep.memory.task = "harvesting";
            }
            
            if (creep.memory.task === "harvesting")
            {
                taskHarvesting.run(creep, "repairing");
            }
            
            if (creep.memory.task === "repairing")
            {
                if (creep.carry.energy !== 0)
                {
                    let containerToRepair = creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                        filter: function (object) { 
                            return object.structureType === STRUCTURE_CONTAINER && (object.hits < object.hitsMax); 
                        }
                    });
                    
                    if (containerToRepair !== null)
                    {
                        if (creep.repair(containerToRepair) === ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(containerToRepair);
                        }
                    }
                    else
                    {
                        let roadToRepair = creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                            filter: function (object) { 
                                return object.structureType === STRUCTURE_ROAD && (object.hits < object.hitsMax); 
                            } 
                        });
                        
                        if (creep.repair(roadToRepair) === ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(roadToRepair);
                        }
                        else
                        {
                            let wallToRepair = creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                                filter: function (object) { 
                                    return object.structureType === STRUCTURE_WALL && (object.hits < object.hitsMax); 
                                } 
                            });
                            
                            if (creep.repair(wallToRepair) === ERR_NOT_IN_RANGE)
                            {
                                creep.moveTo(wallToRepair);
                            }
                            else
                            {
                                taskDelivering.run(creep, "harvesting");
                            }
                        }
                    }
                }
                else
                {
                    creep.memory.task = "harvesting";
                }
            }
            
            continue;
        }
        
        if (creep.memory.role === "builder")
        {
            if (creep.memory.task !== "building" && creep.memory.task !== "harvesting" )
            {
                creep.memory.task = "harvesting";
            }
            
            if (creep.memory.task === "harvesting")
            {
                let storage = creep.room.storage;

                if (storage !== undefined && storage.store[RESOURCE_ENERGY] > 0)
                {
                    let errId = creep.withdraw(storage, RESOURCE_ENERGY);
                    
                    if (errId === OK || errId === ERR_FULL)
                    {
                        creep.memory.task = "building";
                    }
                    else if (errId === ERR_NOT_IN_RANGE)
                    {
                        if (creep.fatigue === 0)
                        {
                            creep.moveTo(storage);
                        }
                    }
                }
                else
                {
                    let container = creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                        filter: function (object) { 
                            return object.structureType === STRUCTURE_CONTAINER && (object.store.energy > 0); 
                        } 
                    });

                    if (container !== null)
                    {
                        let errId = creep.withdraw(container, RESOURCE_ENERGY);
                        
                        if (errId === OK || errId === ERR_FULL)
                        {
                            creep.memory.task = "building";
                        }
                        else if (errId === ERR_NOT_IN_RANGE)
                        {
                            if (creep.fatigue === 0)
                            {
                                creep.moveTo(container);
                            }
                        }
                    }
                    else
                    {
                        taskHarvesting.run(creep, "building");
                    }
                }
            }
            
            if (creep.memory.task === "building")
            {
                if (creep.carry.energy !== 0)
                {
                    let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                    
                    if (creep.build(target) === ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(target);
                    }
                }
                else
                {
                    creep.memory.task = "harvesting";
                }
            }
            
            continue;
        }
        
        if (creep.memory.role === "upgrader")
        {
            if (creep.memory.task !== "harvesting" && creep.memory.task !== "upgrading" )
            {
                creep.memory.task = "harvesting";
            }
            
            if (creep.memory.task === "harvesting")
            {
                let storage = creep.room.storage;

                if (storage !== undefined && storage.store[RESOURCE_ENERGY] > 0)
                {
                    let errId = creep.withdraw(storage, RESOURCE_ENERGY);
                    
                    if (errId === OK || errId === ERR_FULL)
                    {
                        creep.memory.task = "upgrading";
                    }
                    else if (errId === ERR_NOT_IN_RANGE)
                    {
                        if (creep.fatigue === 0)
                        {
                            creep.moveTo(storage);
                        }
                    }
                }
                else
                {
                    let container = creep.pos.findClosestByPath(FIND_STRUCTURES, { 
                        filter: function (object) { 
                            return object.structureType === STRUCTURE_CONTAINER && (object.store.energy > 0); 
                        } 
                    });

                    if (container !== null)
                    {
                        let errId = creep.withdraw(container, RESOURCE_ENERGY);
                        
                        if (errId === OK || errId === ERR_FULL)
                        {
                            creep.memory.task = "upgrading";
                        }
                        else if (errId === ERR_NOT_IN_RANGE)
                        {
                            if (creep.fatigue === 0)
                            {
                                creep.moveTo(container);
                            }
                        }
                    }
                    else
                    {
                        taskHarvesting.run(creep, "upgrading");
                    }
                }
            }
            
            if (creep.memory.task === "upgrading")
            {
                if (creep.carry.energy !== 0)
                {
                    let target = creep.room.controller;
                    
                    if (creep.upgradeController(target) === ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(target);
                    }
                }
                else
                {
                    creep.memory.task = "harvesting";
                }
            }
            
            continue;
        }
    }
    
    function setRoomStage(room)
    {
        if (room.controller === undefined) {
            room.memory.stage = 0;
            return;
        }
        
        if (room.controller.level === 0) {
            room.memory.stage = 0;
            return;
        }
        
        if (room.controller.level === 1) {
            room.memory.stage = 1;
            return;
        }
        
        if (room.controller.level === 2) {
            if (room.energyCapacityAvailable < 550) {
                room.memory.stage = 2;
            }
            else {
                room.memory.stage = 3;
            }
        }
    }
}