const { get } = require('axios');
const { getCache, setCache } = require('../repositories/redis/cache-repository');
const { isNotFound } = require('../../commons/http-errors');

const { API_LUIZALABS } = process.env;

exports.fetchProdutoAPI = async idProduto => {
    try {
        const produtoCache = await getCache(idProduto);
        if (produtoCache) {
            return JSON.parse(produtoCache);
        }

        const result = await get(`${API_LUIZALABS}/${idProduto}/`);
        const { data } = result;

        await setCache(idProduto, data);

        return data;
    } catch (err) {
        const { response } = err;

        if (isNotFound(response)) return null;
        throw err;
    }
};
