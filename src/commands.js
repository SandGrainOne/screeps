Empire.createCreep("settler", null, "Elverum", "LLMM", "E79N85", "E79N84");
Empire.createCreep("chemist", null, "Askim", "CCCCMM", "E78N85", "E78N85");
Empire.createCreep("attacker", null, "Askim", "TTTTTTTTTTMMMMMMMMMMAMAMAMAMAMAMAMAMAMAM", "E77N85", "E75N85");
Empire.createCreep("attacker", null, "Larvik", "TTTTTTTTTTMMMMMMMMMMAMAMAMAMAMAMAMAMAMAMAMAMAMAMAM", "E79N85", "E80N84");
Empire.createCreep("builder", null, "Larvik", "WWCCCCMMM", "E79N85", "E79N84");

JSON.stringify(Game.market.getOrderById("58fdaaae3ac756396a6062cd"))
Game.market.deal("58fdaaae3ac756396a6062cd", 20000, "E77N85")