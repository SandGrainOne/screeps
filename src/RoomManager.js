'use strict';

/**
 * Room manager will determine the stage of the room and make creep requests.
 */
class RoomManager
{
    analyze(room)
    {
        room.memory.settings = 
        {
            miners: 3,
            upgraders: 6,
            builders: 2,
            repairers: 1,
            haulers: 3
        };
            
        if (room.controller === undefined)
        {
            room.memory.stage = 0;
            return;
        }
        
        if (room.controller.level === 0)
        {
            room.memory.stage = 0;
            return;
        }
        
        if (room.controller.level === 1)
        {
            room.memory.stage = 1;
            return;
        }
        
        if (room.controller.level === 2)
        {
            if (room.energyCapacityAvailable < 550)
            {
                room.memory.stage = 2;
            }
            else
            {
                room.memory.stage = 3;
            }
        }
    }
}

module.exports = RoomManager;