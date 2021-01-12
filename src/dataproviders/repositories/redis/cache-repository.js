const RedisBD = require('../../../configuration/databases/redis');

const {
    TEMPO_CACHE_PRODUTO_SEGUNDOS = 120,
    REDIS_REQUEST_TIMEOUT_MILLISECONDS = 1000,
} = process.env;

exports.getCache = async key =>
    RedisBD.client()
        .get(`produtos:${key}`)
        .timeout(REDIS_REQUEST_TIMEOUT_MILLISECONDS)
        .then(cache =>
            cache ? (console.log(`REDIS: dados obtido do cache!`), JSON.parse(cache)) : null
        )
        .catch(err => console.log('ERROR_REDIS: timeout getCache'));

exports.setCache = async (key, value) =>
    RedisBD.client()
        .set(`produtos:${key}`, JSON.stringify(value), 'EX', +TEMPO_CACHE_PRODUTO_SEGUNDOS)
        .timeout(REDIS_REQUEST_TIMEOUT_MILLISECONDS)
        .then(() => console.log(`REDIS: key ${key} included!`))
        .catch(err => console.log('ERROR_REDIS: timeout setCache'));
