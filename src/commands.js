Empire.createCreep("settler", null, "Askim", "MMLL", "E77N88", "E77N89");
Empire.createCreep("chemist", null, "Askim", "CCCCMM", "E78N85", "E78N85");
Empire.createCreep("attacker", null, "Askim", "TTTTTTTTTTMMMMMMMMMMAMAMAMAMAMAMAMAMAMAM", "E77N85", "E75N85");
Empire.createCreep("builder", null, "Rygge", "WWWWWCCCCCCCCCCMMMMMMMMMMMMMMM", "E79N86", "E78N86")

Game.spawns.Askim.createCreep([CLAIM, MOVE, MOVE, MOVE, MOVE], null, { job: "settler", workroom: "E79N86", homeroom: "E79N86" })

Game.spawns.Askim.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE], null, { job: "attacker", rooms: { work: "E76N89", home: "E76N89" } });

Game.spawns.Bergen.createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, { job: "dismantler", workroom: "E77N85" });

Game.spawns.Bergen.createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, { job: "balancer", homeroom: "E78N85", workroom: "E77N85" })

Game.spawns.Bergen.createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, { job: "builder", workroom: "E77N85" });

Upgrader:
Game.spawns.Askim.createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, {job: "upgrader", rooms: { work: "E76N89", home: "E76N89" } })

Game.spawns.Askim.createCreep([WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE], null, {job: "dismantler", rooms: { work: "E77N89" } })

let body = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE];
Game.spawns.Askim.createCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE], null, { job: "healer", rooms: { home: "E76N89", work: "E76N89" } });


JSON.stringify(Game.market.getOrderById("58e155d4d4d4aeec739fec33"))
Game.market.deal("58e155d4d4d4aeec739fec33", 20000, "E77N85")