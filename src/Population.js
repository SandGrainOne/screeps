/*
 * The Population class is responsible for keeping information about all rooms and their creeps grouped by jobs.
 */
class Population {
     /**
     * Initializes a new instance of the Population class.
     */
    constructor() {
        Memory.population = {};
    }

    /**
     * Build up a structure with creep names organized in rooms and jobs.
     */
    populate() {
        // Loop through rooms in memory to ensure that they are registered even if there are no creeps assigned to it.
        for (let roomName in Memory.rooms) {
            if (!Memory.population[roomName]) {
                Memory.population[roomName] = {};
            }
        }
        
        // Loop through all creeps in memory and sort them to quick access buckets.
        for (let creepName in Memory.creeps) {
            let creep = Game.creeps[creepName];
            if (!creep) {
                // The creep must have died
                delete Memory.creeps[creepName];
                continue;
            }

            // Just in case there is a creep without a work room.
            let workroom = creep.memory.workroom ? creep.memory.workroom : creep.room.name;

            if (!Memory.population[workroom]) {
                Memory.population[workroom] = {};
            }

            if (!Memory.population[workroom][creep.memory.job + 's']) {
                Memory.population[workroom][creep.memory.job + 's'] = [];
            }            

            Memory.population[workroom][creep.memory.job + 's'].push(creepName);
        }
        
        // Create easy access creep lists for rooms.
        for (let room in Memory.population) {
            this[room] = Memory.population[room];
        }
    }
}

module.exports = Population;