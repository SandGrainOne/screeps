'use strict';

let RoomBase = require('Room.Base');

/**
 * Room manager will determine the stage of the room and make creep requests.
 */
class RoomManager {

    analyze(room) {
        
        let smartRoom = this.wrap(room);
        

        if (room.controller) {
            if (room.controller.my) {
                room.memory.type = "body";
            }
            if (room.controller.reservation && room.controller.reservation.my){
                room.memory.type = "arm";
            }
        }
        else {
            room.memory.type = "empty";
        }
            
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

    wrap(room) {
        switch (room.memory.type) {
            case 'body':
                return new RoomBase(room);
            
            default:
                return new RoomBase(room);
        }
    }
}

module.exports = RoomManager;