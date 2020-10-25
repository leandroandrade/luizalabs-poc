const { createError } = require('../../commons/http-error');
const { fetchProdutoAPI } = require('../../integration/challenge-luizalabs');
const favoritos = require('../../dataproviders/favoritos/favoritos.data');

exports.registraProdutoFavoritos = async (req, res, next) => {
    const { idCliente } = req.params;
    const { id: idProduto } = req.body;

    if (!idProduto) {
        return next(createError(400, `O produto deve ser informado`));
    }

    const isRegistrado = await favoritos.isProdutoRegistrado({ idCliente, idProduto });
    if (isRegistrado) {
        return next(createError(400, `O produto ${idProduto} já registrado como favorito`));
    }

    const result = await fetchProdutoAPI(idProduto);
    if (!result) {
        return next(createError(404, `Produto ${idProduto} não encontrado`));
    }

    const { price, image, title } = result;
    const produto = {
        idCliente,
        id: idProduto,
        price,
        image,
        title,
        createdAt: new Date(),
    };
    await favoritos.registraProduto(produto);

    return res.json({
        mensagem: `Produto ${idProduto} incluido na lista de favoritos com sucesso!`,
    });
};
