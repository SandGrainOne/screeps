'use strict';

let RoomBaseV2 = require('Room.BaseV2');

class RoomFactory {
    /**
     * Add a layer of room type specific logic to the given room.
     * 
     * @param {Room} room - The room to be wrapped.
     */
    wrap(room) {
        switch (room.memory.type) {
            case 'owned':
                return new RoomBaseV2(room);

            case 'reserved':
                return new RoomBaseV2(room);
            
            default:
                return new RoomBaseV2(room);
        }
    }
}

module.exports = RoomFactory;