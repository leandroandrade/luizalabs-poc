const { v4: uuidv4 } = require('uuid');
const { createError } = require('../../commons/http-error');
const clientes = require('../../dataproviders/clientes/clientes.data');

exports.registraCliente = async (req, res, next) => {
    const { nome, email } = req.body;

    const isCadastrado = await clientes.isExiste(email);
    if (isCadastrado) {
        return next(createError(400, `Cliente com email ${email} já registrado!`));
    }

    const cliente = { nome, email, id: uuidv4() };
    await clientes.registra({ ...cliente });

    return res.status(201).json(cliente);
};
