const Redis = require('ioredis');
const log = require('../logger');

const { REDIS_HOST, REDIS_PORT, TEMPO_CACHE_PRODUTO_SEGUNDOS = 120 } = process.env;

const client = new Redis({
    port: REDIS_PORT,
    host: REDIS_HOST,
    keyPrefix: 'luizalabs:',
    showFriendlyErrorStack: true,
});

client.on('connect', () => log.info('> Redis conectado com sucesso'));

const getCache = async key => client.get(`produtos:${key}`);
const setCache = async (key, value) =>
    client.set(`produtos:${key}`, JSON.stringify(value), 'EX', +TEMPO_CACHE_PRODUTO_SEGUNDOS);

module.exports = { getCache, setCache };
