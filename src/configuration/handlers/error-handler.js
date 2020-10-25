const log = require('../log');

module.exports = (err, req, res, next) => {
    log.error('Server ERROR:', err);

    next(err);
};
