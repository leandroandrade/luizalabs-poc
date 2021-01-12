const Redis = require('ioredis');
const Promise = require('bluebird');
const log = require('../logger');

Promise.config({ cancellation: true });
Redis.Promise = Promise;

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
