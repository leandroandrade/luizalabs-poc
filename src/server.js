if (process.env.NODE_ENV !== 'production') {
    require('dotenv-safe/config');
}

const log = require('./configuration/logger');
const MongoDB = require('./configuration/databases/mongodb');
const app = require('./app');

MongoDB.connect()
    .then(() => {
        log.info('> MongoDB connected successful');

        app.listen(process.env.PORT, () =>
            log.info(`> luizalabs-poc start on port ${process.env.PORT} | ${process.env.NODE_ENV} `)
        );
    })
    .catch(err => log.info(err));
