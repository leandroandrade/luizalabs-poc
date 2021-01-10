const Redis = require('ioredis');
const log = require('../logger');

module.exports = {
    async connect() {
        const client = new Redis({
            port: process.env.REDIS_PORT,
            host: process.env.REDIS_HOST,
            keyPrefix: 'luizalabs:',
            showFriendlyErrorStack: true,
            lazyConnect: true,
        });

        await client.connect();
        this.client = client;

        log.info('> RedisDB connected successful');
    },

    disconnect() {
        this.client.disconnect();
    },

    getClient() {
        return this.client;
    },
};
