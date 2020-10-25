const { createError } = require('../../commons/http-error');
const clientes = require('../../dataproviders/clientes/clientes.data');

exports.pesquisaClientePorID = async (req, res, next) => {
    const { id } = req.params;

    const cliente = await clientes.porID(id);
    if (!cliente) {
        return next(createError(404, `Cliente com id ${id} não encontrado`));
    }
    return res.json(cliente);
};
