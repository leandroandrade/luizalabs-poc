const { promisify } = require('util');
const verify = promisify(require('jsonwebtoken').verify);

const { JWT_SECRET } = process.env;

const { createError } = require('../../commons/http-error');

module.exports = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return next(createError(401, 'Token não informado!'));
    }

    try {
        const decoded = await verify(token, JWT_SECRET);
        req.id = decoded.id;
        req.username = decoded.username;
        req.role = decoded.role;

        return next();
    } catch (err) {
        return next(createError(401, 'Token invalido!'));
    }
};
