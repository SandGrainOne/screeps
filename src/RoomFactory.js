'use strict';

let RoomReal = require('Room.Real');

class RoomFactory {
    /**
     * Add a layer of room type specific logic to the given room.
     * 
     * @param {Room} room - The room to be wrapped.
     */
    wrap(room) {
        switch (room.memory.type) {
            case 'owned':
                return new RoomReal(room);

            case 'reserved':
                return new RoomReal(room);
            
            default:
                return new RoomReal(room);
        }
    }
}

module.exports = RoomFactory;