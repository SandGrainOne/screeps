'use strict';

let RoomBase = require('Room.Base');

class RoomFactory {
    /**
     * Add a layer of room type spesific logic to the given room.
     * 
     * @param {Room} room - The room to be wrapped.
     */
    wrap(room) {
        switch (room.memory.type) {
            case 'owned':
                return new RoomBase(room);

            case 'reserved':
                return new RoomBase(room);
            
            default:
                return new RoomBase(room);
        }
    }
}

module.exports = RoomFactory;