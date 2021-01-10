if (process.env.NODE_ENV !== 'production') require('dotenv-safe/config');

const { PORT, NODE_ENV } = process.env;
const log = require('./configuration/logger');
const { MongoDB, RedisDB } = require('./configuration/databases');

Promise.all([MongoDB.connect(), RedisDB.connect()])
    .then(() => {
        const app = require('./app');

        app.listen(PORT, () => log.info(`> Server start on port ${PORT} | ${NODE_ENV} `));
    })
    .catch(err => log.error(err));
