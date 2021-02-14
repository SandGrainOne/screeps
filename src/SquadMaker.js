'use strict';

const SquadBase = require('./Squad.Base');

const squadTypes = {
    dummy: require('./Squad.Dummy')
};

/**
 * The SquadMaker class is a static helper class for the construction of squads.
 */
class SquadMaker {
    prepare () {
        os.logger.info('preparing squads');
    }

    /**
     * Analyse the given memory object and retrieve the correct AI instance.
     * 
     * @param {object} squadMemory 
     */
    getAiInstance (squadMemory) {
        // os.logger.info(JSON.stringify(squadMemory));
    }

    /**
     * Create a squad of the right type.
     * 
     * @param {string} squadName - The name of the Squad being created
     * @param {string} squadType - The type of Squad to create
     */
    static create (squadName, squadType) {
        let squad = null;

        if (squadTypes[squadType] !== undefined) {
            squad = new squadTypes[squadType](squadName);
        }

        if (!squad) {
            os.logger.warning('Squad ' + squadName + ' is of an unknown type: ' + squadType);
            squad = new SquadBase(squadName);
        }

        return squad;
    }
}

module.exports = SquadMaker;
