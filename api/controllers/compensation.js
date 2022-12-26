
const { fetchCompensationData } = require('services/compensation')
const { loggerCompensation } = require('config/logger');

const getCompensation = (req, res) => {
    //All validations for the request query paramaters are done by swagger.

    loggerCompensation.verbose(
        req.uuid,
        'controllers/compensation/getCompensation get',
        req.query
    );
    fetchCompensationData(req.query)
        .then(data => {
            return res.json(data);
        })
        .catch(err => {
            loggerCompensation.error(
                req.uuid,
                'controllers/compensation/getCompensation err',
                err.message
            );
            return res.status(err.statusCode || 400).json({ message: err.message });
        })
}

module.exports = {
    getCompensation
}

