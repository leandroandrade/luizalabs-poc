module.exports = (err, req, res, next) => {
    const { statusCode, messages, message } = err;

    if (statusCode && messages) {
        return res.status(statusCode).send({ mensagens: messages });
    }

    if (statusCode && message) {
        return res.status(statusCode).send({
            mensagens: [{ codigo: statusCode, mensagem: message }],
        });
    }

    return res.status(500).send({
        mensagens: messages || [{ codigo: 500, mensagem: 'Ocorreu um erro no servidor.' }],
    });
};
