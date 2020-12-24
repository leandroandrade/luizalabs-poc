const clientes = require('../../dataproviders/clientes/clientes.data');
const { BusinessError } = require('../../commons/errors');

exports.atualizaCliente = async (req, res, next) => {
    const { id } = req.params;
    const { nome } = req.body;

    const isNaoExiste = await clientes.isNaoCadastrado(id);
    if (isNaoExiste) {
        throw new BusinessError(`Cliente com id ${id} não encontrado`, 404);
    }

    await clientes.atualiza({ id, nome });

    return res.status(204).end();
};
