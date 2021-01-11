const favoritos = require('../../../dataproviders/repositories/favoritos.repository');
const { isPaginaInvalida } = require('../../../commons/pagination/paginacao');
const { InvalidQueryStringError } = require('../../../commons/errors');

exports.pesquisaProdutosFavoritos = async (req, res, next) => {
    const { idCliente } = req.params;
    const { pagina, registrosPorPagina } = req.query;

    if (pagina && isPaginaInvalida(pagina)) {
        throw new InvalidQueryStringError('A pagina informada é inválida!');
    }

    if (registrosPorPagina && isPaginaInvalida(registrosPorPagina)) {
        throw new InvalidQueryStringError('Os registrosPorPagina informado é inválido!');
    }

    const result = await favoritos.porCliente({
        idCliente,
        pagina: pagina || 1,
        registrosPorPagina: registrosPorPagina || 5,
    });
    return res.json({ resultado: result });
};
