const { createError } = require('../../commons/http-error');
const clientes = require('../../dataproviders/clientes/clientes.data');

exports.atualizaCliente = async (req, res, next) => {
    const { id } = req.params;
    const { nome } = req.body;

    const isNaoExiste = await clientes.isNaoCadastrado(id);
    if (isNaoExiste) {
        return next(createError(404, `Cliente com id ${id} não encontrado`));
    }

    await clientes.atualiza({ id, nome });

    return res.status(204).end();
};
