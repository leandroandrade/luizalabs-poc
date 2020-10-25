const { createError } = require('../../commons/http-error');

module.exports = async (req, res, next) => {
    const { role } = req;
    if (!role) {
        return next(createError(401, 'Acesso negado'));
    }

    if (role !== 'ADMIN') {
        return next(createError(401, 'Você não possui privilégios para executar essa ação'));
    }

    return next();
};
