const { sign } = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { createError } = require('../../commons/http-error');

const { JWT_SECRET } = process.env;

exports.geraTokenAcesso = async (req, res, next) => {
    const { username, password, role } = req.body;

    if (!username || !password) {
        return next(createError(401, 'Usuario e senha devem ser informados!'));
    }

    if (username === 'luizalabs' && password === 'luizalabs') {
        const random = uuidv4();

        return res.json({
            token: sign({ id: random, username, role: role || 'GUEST' }, JWT_SECRET, {
                expiresIn: '7d',
            }),
        });
    }

    return next(createError(401, 'Usuario ou senha inválidos'));
};
