const { authMiddleware, adminMiddleware } = require('../middlewares');
const {
    pesquisaProdutosFavoritos,
} = require('../../entrypoints/rest/favoritos/pesquisa-produtos-favoritos.entrypoint');
const {
    registraProdutoFavoritos,
} = require('../../entrypoints/rest/favoritos/registra-produto-favorito.entrypoint');
const {
    removeProdutoFavoritos,
} = require('../../entrypoints/rest/favoritos/remove-produto-favoritos.entrypoint');

module.exports = router => {
    router.use(authMiddleware);
    router.use(adminMiddleware);

    router.post('/clientes/:idCliente/favoritos/produtos', registraProdutoFavoritos);
    router.get('/clientes/:idCliente/favoritos/produtos', pesquisaProdutosFavoritos);
    router.delete('/clientes/:idCliente/produtos/:idProduto/favoritos', removeProdutoFavoritos);
};
