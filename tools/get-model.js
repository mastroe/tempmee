const { PROVIDE_MODEL_NAME } = require('config/constants');
const CompensationModel = require('models/compensation')

const dbModels = {
    'compensation': CompensationModel
}

const getModel = (model = '') => {
    if (model.length === 0) {
        throw new Error(PROVIDE_MODEL_NAME);
    }

    return dbModels[model.toLowerCase()];
};

module.exports = getModel