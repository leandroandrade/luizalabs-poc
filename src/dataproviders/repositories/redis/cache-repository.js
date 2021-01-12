const Promise = require('bluebird');

const { TEMPO_CACHE_PRODUTO_SEGUNDOS = 120 } = process.env;
const RedisBD = require('../../../configuration/databases/redis');

Promise.config({
    cancellation: true,
});

exports.getCache = async key => RedisBD.client().get(`produtos:${key}`);

exports.setCache = async (key, value) =>
    RedisBD.client().set(
        `produtos:${key}`,
        JSON.stringify(value),
        'EX',
        +TEMPO_CACHE_PRODUTO_SEGUNDOS
    );
