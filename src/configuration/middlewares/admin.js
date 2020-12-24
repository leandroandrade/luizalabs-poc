const { BusinessError } = require('../../commons/errors');

module.exports = async (req, res, next) => {
    const { role } = req;
    if (!role) {
        throw new BusinessError('Acesso negado', 401);
    }

    if (role !== 'ADMIN') {
        throw new BusinessError('Você não possui privilégios para executar essa ação', 401);
    }

    return next();
};
