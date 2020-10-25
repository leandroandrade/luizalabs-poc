const router = require('express').Router();

const { name, version } = require('../../../package.json');
const authMiddleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');

const { geraTokenAcesso } = require('../../entrypoints/auth/auth.entrypoint');

const { pesquisaClientes } = require('../../entrypoints/clientes/pesquisa-clientes.entrypoint');
const {
    pesquisaClientePorID,
} = require('../../entrypoints/clientes/pesquisa-cliente-por-id.entrypoint');
const { registraCliente } = require('../../entrypoints/clientes/registra-cliente.entrypoint');
const { atualizaCliente } = require('../../entrypoints/clientes/atualiza-cliente.entrypoint');
const { removeCliente } = require('../../entrypoints/clientes/remove-cliente.entrypoint');

const {
    pesquisaProdutosFavoritos,
} = require('../../entrypoints/favoritos/pesquisa-produtos-favoritos.entrypoint');
const {
    registraProdutoFavoritos,
} = require('../../entrypoints/favoritos/registra-produto-favorito.entrypoint');
const {
    removeProdutoFavoritos,
} = require('../../entrypoints/favoritos/remove-produto-favoritos.entrypoint');

module.exports = app => {
    router.get('/', (_, res) =>
        res.json({
            name,
            version,
        })
    );

    router.post('/auth', geraTokenAcesso);

    router.use(authMiddleware);
    router.use(adminMiddleware);

    router.post('/clientes', registraCliente);
    router.get('/clientes', pesquisaClientes);
    router.get('/clientes/:id', pesquisaClientePorID);
    router.put('/clientes/:id', atualizaCliente);
    router.delete('/clientes/:id', removeCliente);

    router.post('/clientes/:idCliente/favoritos/produtos', registraProdutoFavoritos);
    router.get('/clientes/:idCliente/favoritos/produtos', pesquisaProdutosFavoritos);
    router.delete('/clientes/:idCliente/produtos/:idProduto/favoritos', removeProdutoFavoritos);

    app.use('/api/v1', router);
};
