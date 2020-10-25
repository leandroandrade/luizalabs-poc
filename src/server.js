if (process.env.NODE_ENV !== 'production') {
    require('dotenv-safe/config');
}

const log = require('./configuration/log');
const MongoDB = require('./configuration/databases/mongodb');
const app = require('./app');

MongoDB.connect()
    .then(() => log.info('> MongoDB connected successful'))
    .catch(err => log.info(err));

const { PORT, NODE_ENV } = process.env;

app.listen(PORT, () => log.info(`> luizalabs-poc start on port ${PORT} | ${NODE_ENV} `));
