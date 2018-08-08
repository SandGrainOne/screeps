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
     * Build up a structure with creeps organized in rooms and jobs.
     */
    populate() {
        // Loop through all creeps in memory and sort them to quick access buckets.
        for (let creepName in Memory.creeps) {
            let creep = Game.creeps[creepName];
            if (!creep) {
                // The creep must have died
                delete Memory.creeps[creepName];
                continue;
            }

            // Just in case I forget to set the remote room value on a new creep.
            let remoteroom = creep.memory.remoteroom ? creep.memory.remoteroom : creep.room.name;

            if (!this[remoteroom]) {
                this[remoteroom] = {};
            }

            if (!this[remoteroom][creep.memory.job + 's']) {
                this[remoteroom][creep.memory.job + 's'] = [];
            }            

            this[remoteroom][creep.memory.job + 's'].push(creep);
        }
    }
}

module.exports = Population;