const { promisify } = require('util');
const verify = promisify(require('jsonwebtoken').verify);

const { JWT_SECRET } = process.env;
const { BusinessError } = require('../../commons/errors');

module.exports = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        throw new BusinessError('Token não informado!', 401);
    }

    try {
        const decoded = await verify(token, JWT_SECRET);
        req.id = decoded.id;
        req.username = decoded.username;
        req.role = decoded.role;

        return next();
    } catch (err) {
        throw new BusinessError('Token invalido!', 401);
    }
};
