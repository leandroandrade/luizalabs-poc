const { authMiddleware, adminMiddleware } = require('../middlewares');

const {
    pesquisaClientes,
} = require('../../entrypoints/rest/clientes/pesquisa-clientes.entrypoint');
const {
    pesquisaClientePorID,
} = require('../../entrypoints/rest/clientes/pesquisa-cliente-por-id.entrypoint');
const { registraCliente } = require('../../entrypoints/rest/clientes/registra-cliente.entrypoint');
const { atualizaCliente } = require('../../entrypoints/rest/clientes/atualiza-cliente.entrypoint');
const { removeCliente } = require('../../entrypoints/rest/clientes/remove-cliente.entrypoint');

module.exports = router => {
    router.use(authMiddleware);
    router.use(adminMiddleware);

    router.post('/clientes', registraCliente);
    router.get('/clientes', pesquisaClientes);
    router.get('/clientes/:id', pesquisaClientePorID);
    router.put('/clientes/:id', atualizaCliente);
    router.delete('/clientes/:id', removeCliente);
};
