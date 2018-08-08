module.exports = {
    run(creep, next) 
    {
        if (creep.carry.energy < creep.carryCapacity)
        {
            let source = creep.pos.findClosestByPath(FIND_SOURCES);
            
            if (source === null)
            {
                return;
            }
            
            let keeper = source.pos.findInRange(FIND_HOSTILE_CREEPS, 5);

            if (keeper != null && keeper.length > 0)
            {
                return;
            }
            
            if (creep.harvest(source) == ERR_NOT_IN_RANGE)
            {
                if (creep.fatigue == 0)
                {
                    creep.moveTo(source);
                }
            }
        }
        else
        {
            creep.memory.task = next;
        }
    }
}