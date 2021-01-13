if (process.env.NODE_ENV !== 'production') require('dotenv-safe/config');

const log = require('./configuration/logger');
const exit = require('./configuration/exit');

const { PORT, NODE_ENV } = process.env;
const { MongoDB, RedisDB } = require('./configuration/databases');

Promise.all([MongoDB.connect(), RedisDB.connect()])
    .then(() => {
        const app = require('./configuration/app');

        const server = app.listen(PORT, () => {
            log.info(`Luizalabs-poc start on port ${PORT} | ${NODE_ENV} `);
            exit(server);
        });
    })
    .catch(err => log.error(err));
