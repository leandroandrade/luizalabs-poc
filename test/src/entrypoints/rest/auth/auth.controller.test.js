const request = require('supertest');

const app = require('../../../../../src/app');

describe('auth.controller tests', () => {
    it('deve retornar erro caso o usuario e senha nao sejam informados', async done => {
        const { status, body } = await request(app).post('/api/v1/auth');

        expect(status).toBe(401);
        expect(body).not.toBeNull();
        expect(body).not.toBeUndefined();

        const { mensagens } = body;
        expect(mensagens).not.toBeNull();

        const [data] = mensagens;
        const { codigo, mensagem } = data;
        expect(codigo).toBe(401);
        expect(mensagem).toBe('Usuario e senha devem ser informados!');

        done();
    });

    it('deve retornar erro caso o usuario e senha sejam invalidos', async done => {
        const { status, body } = await request(app)
            .post('/api/v1/auth')
            .send({ username: 'admin', password: 'admin' });

        expect(status).toBe(401);
        expect(body).not.toBeNull();
        expect(body).not.toBeUndefined();

        const { mensagens } = body;
        expect(mensagens).not.toBeNull();

        const [data] = mensagens;
        const { codigo, mensagem } = data;
        expect(codigo).toBe(401);
        expect(mensagem).toBe('Usuario ou senha inválidos');

        done();
    });

    it('deve retornar um token valido', async done => {
        const { status, body } = await request(app)
            .post('/api/v1/auth')
            .send({ username: 'luizalabs', password: 'luizalabs', role: 'ADMIN' });

        expect(status).toBe(200);
        expect(body).not.toBeNull();
        expect(body).not.toBeUndefined();

        const { token } = body;
        expect(token).not.toBeNull();

        done();
    });
});
