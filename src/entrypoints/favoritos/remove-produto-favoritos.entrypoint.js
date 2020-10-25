const favoritos = require('../../dataproviders/favoritos/favoritos.data');

exports.removeProdutoFavoritos = async (req, res, next) => {
    const { idCliente, idProduto } = req.params;

    await favoritos.remove({ idCliente, idProduto });
    return res.status(204).end();
};
