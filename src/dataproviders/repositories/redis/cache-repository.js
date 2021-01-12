const { RedisDB } = require('../../../configuration/databases');
const log = require('../../../configuration/logger');

const {
    TEMPO_CACHE_PRODUTO_SEGUNDOS = 120,
    REDIS_REQUEST_TIMEOUT_MILLISECONDS = 1000,
} = process.env;

exports.getCache = async key =>
    RedisDB.client()
        .get(`produtos:${key}`)
        .timeout(REDIS_REQUEST_TIMEOUT_MILLISECONDS)
        .then(cache =>
            cache ? (log.info(`REDIS: dados obtido do cache!`), JSON.parse(cache)) : null
        )
        .catch(() => log.warn('ERROR_REDIS: timeout getCache'));

exports.setCache = async (key, value) =>
    RedisDB.client()
        .set(`produtos:${key}`, JSON.stringify(value), 'EX', +TEMPO_CACHE_PRODUTO_SEGUNDOS)
        .timeout(REDIS_REQUEST_TIMEOUT_MILLISECONDS)
        .then(() => log.info(`REDIS: key ${key} included!`))
        .catch(() => log.warn('ERROR_REDIS: timeout setCache'));
