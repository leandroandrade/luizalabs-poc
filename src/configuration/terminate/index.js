const log = require('../logger');
const { MongoDB, RedisDB } = require('../databases');

const shutdown = (signal, server) => {
    log.info(`${signal} signal received`);

    log.info('Closing HTTP server...');
    server.close(async () => {
        log.info('HTTP server closed!');

        log.info('Closing RedisDB server...');
        await RedisDB.disconnect();
        log.info('RedisDB server closed!');

        log.info('Closing MongoDB server...');
        await MongoDB.disconnect();
        log.info('MongoDB server closed!');

        process.exit(0);
    });
};

module.exports = server => {
    process.on('SIGTERM', () => shutdown('SIGTERM', server));
    process.on('SIGINT', () => shutdown('SIGINT', server));
};
