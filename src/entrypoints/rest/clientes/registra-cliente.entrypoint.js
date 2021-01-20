const { v4: uuidv4 } = require('uuid');
const { BusinessError } = require('../../../commons/errors');
const clientes = require('../../../dataproviders/repositories/clientes.repository');

exports.registraCliente = async (req, res, next) => {
    const { nome, email } = req.body;

    const isCadastrado = await clientes.isExiste(email);
    if (isCadastrado) {
        throw new BusinessError(`Cliente com email ${email} já registrado!`);
    }

    if (!nome || !nome.length) {
        throw new BusinessError(`O nome do cliente deve ser informado!`);
    }

    if (!email || !email.length) {
        throw new BusinessError(`O email do cliente deve ser informado!`);
    }

    const cliente = { nome, email, id: uuidv4() };
    await clientes.registra({ ...cliente });

    return res.status(201).json(cliente);
};
