const { sign } = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { BusinessError } = require('../../commons/errors');

const { JWT_SECRET } = process.env;

exports.geraTokenAcesso = async (req, res, next) => {
    const { username, password, role } = req.body;

    if (!username || !password) {
        throw new BusinessError('Usuario e senha devem ser informados!', 401);
    }

    if (username === 'luizalabs' && password === 'luizalabs') {
        const random = uuidv4();

        return res.json({
            token: sign({ id: random, username, role: role || 'GUEST' }, JWT_SECRET, {
                expiresIn: '7d',
            }),
        });
    }

    throw new BusinessError('Usuario ou senha inválidos', 401);
};
