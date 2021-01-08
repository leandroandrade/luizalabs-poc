const log = require('../logger');

module.exports = (err, req, res, next) => {
    log.error('Server ERROR:', err);

    next(err);
};
