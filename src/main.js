'use strict';

let code = require('code');
let tools = require('tools');

let CreepFactory = require('CreepFactory');
let RoomManager = require('RoomManager');

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
    
    let roomManager = new RoomManager();
    let creepFactory = new CreepFactory();
    
    for (let room of controlledRooms)
    {
        let roomCreeps = room.find(FIND_MY_CREEPS);
        let roomSpawn = room.find(FIND_MY_SPAWNS)[0];
        
        if (Game.time % 10 === 0)
        {
            roomManager.analyze(room);
            
            if (room.energyAvailable >= 300 && !roomSpawn.spawning)
            {
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
                
                let numberOfUpgraders = _(roomCreeps).filter( { memory: { role: 'upgrader' } } ).size();
            
                if (numberOfUpgraders < room.memory.settings.upgraders)
                {
                    roomSpawn.createCreep([WORK, CARRY, MOVE, MOVE], null, {role: "upgrader" });
                }

                let numberOfHaulers = _(roomCreeps).filter( { memory: { role: 'hauler' } } ).size();
                
                if (numberOfHaulers < room.memory.settings.haulers)
                {
                    roomSpawn.createCreep([CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], null, { role: "hauler" });
                }
                
                let numberOfMiners = _(roomCreeps).filter( { memory: { role: 'miner' } } ).size();
                
                if (numberOfMiners < room.memory.settings.miners)
                {
                    roomSpawn.createCreep([WORK, WORK, CARRY, MOVE], null, { role: "miner" });
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
    }
}