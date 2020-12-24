const { fetchProdutoAPI } = require('../../integration/challenge-luizalabs');
const favoritos = require('../../dataproviders/favoritos/favoritos.data');
const { InvalidInputError, BusinessError } = require('../../commons/errors');

exports.registraProdutoFavoritos = async (req, res, next) => {
    const { idCliente } = req.params;
    const { id: idProduto } = req.body;

    if (!idProduto) {
        throw new InvalidInputError(`O produto deve ser informado`);
    }

    const isRegistrado = await favoritos.isProdutoRegistrado({ idCliente, idProduto });
    if (isRegistrado) {
        throw new BusinessError(`O produto ${idProduto} já registrado como favorito`);
    }

    const result = await fetchProdutoAPI(idProduto);
    if (!result) {
        throw new BusinessError(`Produto ${idProduto} não encontrado`, 404);
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
