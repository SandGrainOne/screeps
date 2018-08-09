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

        for (let creepName in Game.creeps) {

            let creep = Game.creeps[creepName];

            if (creep.memory.ticksToLive < creep.memory.spawnTime) {
                // Don't count creeps that are retired and about to die.
                continue;
            }

            let workroom = creep.memory.rooms.work;

            if (!Memory.population[workroom]) {
                Memory.population[workroom] = {};
            }

            let job = creep.memory.job;
            if (job.name) {
                job = job.name;
            }

            if (!Memory.population[workroom][job + 's']) {
                Memory.population[workroom][job + 's'] = [];
            }

            Memory.population[workroom][job + 's'].push(creepName);
        }

        // Create easy access creep lists for rooms.
        for (let room in Memory.population) {
            this[room] = Memory.population[room];
        }
    }
}

module.exports = Population;