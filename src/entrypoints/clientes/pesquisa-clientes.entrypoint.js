const clientes = require('../../dataproviders/clientes/clientes.data');
const { isPaginaInvalida } = require('../../commons/paginacao');
const { InvalidQueryStringError } = require('../../commons/errors');

exports.pesquisaClientes = async (req, res, next) => {
    const { pagina, registrosPorPagina } = req.query;

    if (pagina && isPaginaInvalida(pagina)) {
        throw new InvalidQueryStringError('A pagina informada é inválida!');
    }

    if (registrosPorPagina && isPaginaInvalida(registrosPorPagina)) {
        throw new InvalidQueryStringError('Os registrosPorPagina informado é inválido!');
    }

    const result = await clientes.todos({
        pagina: +pagina || 1,
        registrosPorPagina: +registrosPorPagina || 5,
    });
    return res.json({ resultado: result });
};
