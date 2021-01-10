const { TEMPO_CACHE_PRODUTO_SEGUNDOS = 120 } = process.env;
const RedisBD = require('../../../configuration/databases/redis');

exports.getCache = async key => RedisBD.getClient().get(`produtos:${key}`);

exports.setCache = async (key, value) =>
    RedisBD.getClient().set(
        `produtos:${key}`,
        JSON.stringify(value),
        'EX',
        +TEMPO_CACHE_PRODUTO_SEGUNDOS
    );
