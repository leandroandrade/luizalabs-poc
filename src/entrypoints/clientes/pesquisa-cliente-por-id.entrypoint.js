const { BusinessError } = require('../../commons/errors');
const clientes = require('../../dataproviders/clientes/clientes.data');

exports.pesquisaClientePorID = async (req, res, next) => {
    const { id } = req.params;

    const cliente = await clientes.porID(id);
    if (!cliente) {
        throw new BusinessError(`Cliente com id ${id} não encontrado`, 404);
    }
    return res.json(cliente);
};
