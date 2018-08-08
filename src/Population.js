/*
 * The Population class is responsible for keeping informasjon about all creeps and their jobs.
 * It will primarily use the game memory in order to remember everything between ticks.
 */
class Population
{
     /**
     * Initializes a new instance of the Population class.
     */
    constructor()
    {
    }

    /**
     * Refresh all population data being stored.
     */
    refresh()
    {
        Memory.population = {};
        Memory.population.miners = [];
        Memory.population.haulers = [];
        Memory.population.builders = [];
        Memory.population.repairers = [];
        Memory.population.upgraders = [];

        // Loop through all creeps in memory and sort them to quick access buckets.
        for (let creepName in Memory.creeps)
        {
            let creep = Game.creeps[creepName];
            if (!creep) 
            {
                // The creep must be dead.
                console.log(creepName + " has died. Memory: " + JSON.stringify(Memory.creeps[creepName]));
                
                delete Memory.creeps[creepName];
                continue;
            }
            
            switch (creep.memory.role) 
            {
                case "miner":
                    Memory.population.miners.push(creepName);
                    break;
                
                case "hauler":
                    Memory.population.haulers.push(creepName);
                    break;
                
                case "builder":
                    Memory.population.builders.push(creepName);
                    break;
                
                case "repairer":
                    Memory.population.repairers.push(creepName);
                    break;
                
                case "upgrader":
                    Memory.population.upgraders.push(creepName);
                    break;
                
                default:
                    // code
            }
        }
    }
}

module.exports = Population;