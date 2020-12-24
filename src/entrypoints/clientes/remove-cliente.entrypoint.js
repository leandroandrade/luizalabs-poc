const { BusinessError } = require('../../commons/errors');
const clientes = require('../../dataproviders/clientes/clientes.data');
const favoritos = require('../../dataproviders/favoritos/favoritos.data');

exports.removeCliente = async (req, res, next) => {
    const { id } = req.params;

    const isNaoExiste = await clientes.isNaoCadastrado(id);
    if (isNaoExiste) {
        throw new BusinessError(`Cliente com id ${id} não encontrado`, 404);
    }

    await clientes.remove(id);
    await favoritos.removePorCliente(id);

    return res.status(204).end();
};
