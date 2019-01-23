'use strict';

let SquadBase = require('./Squad.Base');

let squadTypes = {
    'dummy': require('./Squad.Dummy')
};

/**
 * The SquadMaker class is a static helper class for the construction of squads.
 */
class SquadMaker {
    /**
     * Create a squad of the right type.
     * 
     * @param {string} squadName - The name of the Squad being created
     * @param {string} squadType - The type of Squad to create
     */
    static create (squadName, squadType) {
        let squad = null;

        if (!_.isUndefined(squadTypes[squadType])) {
            squad = new squadTypes[squadType](squadName);
        }

        if (!squad) {
            console.log('Squad ' + squadName + ' is of an unknown type: ' + squadType);
            squad = new SquadBase(squadName);
        }

        return squad;
    }
}

module.exports = SquadMaker;
