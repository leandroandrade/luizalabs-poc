const Redis = require('ioredis');
const log = require('../logger');

module.exports = {
    async connect() {
        const redis = new Redis({
            port: process.env.REDIS_PORT,
            host: process.env.REDIS_HOST,
            keyPrefix: 'luizalabs:',
            showFriendlyErrorStack: true,
            lazyConnect: true,
            enableOfflineQueue: false,
        });

        await redis.connect();
        this.redis = redis;

        log.info('RedisDB connected successful');
    },

    disconnect() {
        this.redis.disconnect();
    },

    client() {
        return this.redis;
    },
};
