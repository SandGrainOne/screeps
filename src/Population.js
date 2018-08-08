/*
 * The Population class is responsible for keeping informasjon about all creeps and their jobs.
 * It will primarily use the game memory in order to remember everything between ticks.
 */
class Population {
     /**
     * Initializes a new instance of the Population class.
     */
    constructor() {
    }

    /**
     * Refresh all population data being stored.
     */
    refresh() {
        Memory.population = {};

        // Loop through all creeps in memory and sort them to quick access buckets.
        for (let creepName in Memory.creeps) {
            let creep = Game.creeps[creepName];
            if (!creep) {
                // The creep must be dead.
                console.log(creepName + " has died. Memory: " + JSON.stringify(Memory.creeps[creepName]));
                
                delete Memory.creeps[creepName];
                continue;
            }

            let homeroom = creep.memory.homeroom ? creep.memory.homeroom : creep.room.name;

            if (!Memory.population[homeroom]) {
                Memory.population[homeroom] = {};
            }

            if (!Memory.population[homeroom][creep.memory.role + 's']) {
                Memory.population[homeroom][creep.memory.role + 's'] = [];
            }            

            Memory.population[homeroom][creep.memory.role + 's'].push(creepName);
        }
    }
}

module.exports = Population;