const Redis = require('ioredis');
const log = require('../logger');

module.exports = {
    async connect() {
        const client = new Redis({
            port: process.env.REDIS_PORT,
            host: process.env.REDIS_HOST,
            keyPrefix: 'luizalabs:',
            showFriendlyErrorStack: true,
        });
        client.on('connect', () => log.info('> RedisDB connected successful'));

        this.client = client;
    },

    disconnect() {
        this.client.disconnect();
    },

    getClient() {
        return this.client;
    },
};
