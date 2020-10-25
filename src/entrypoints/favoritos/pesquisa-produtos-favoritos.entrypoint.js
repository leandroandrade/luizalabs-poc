const favoritos = require('../../dataproviders/favoritos/favoritos.data');
const { isPaginaInvalida } = require('../../commons/paginacao');
const { createError } = require('../../commons/http-error');

exports.pesquisaProdutosFavoritos = async (req, res, next) => {
    const { idCliente } = req.params;
    const { pagina, registrosPorPagina } = req.query;

    if (pagina && isPaginaInvalida(pagina)) {
        return next(createError(400, 'A pagina informada é inválida!'));
    }

    if (registrosPorPagina && isPaginaInvalida(registrosPorPagina)) {
        return next(createError(400, 'Os registrosPorPagina informado é inválido!'));
    }

    const result = await favoritos.porCliente({
        idCliente,
        pagina: pagina || 1,
        registrosPorPagina: registrosPorPagina || 5,
    });
    return res.json({ resultado: result });
};
