const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoMemory = new MongoMemoryServer();

const mongodb = require('../../../../../src/configuration/databases/mongodb');
const app = require('../../../../../src/app');

describe('Registra cliente test', () => {
    beforeAll(async () => {
        process.env.MONGODB_URL = await mongoMemory.getUri(true);
        process.env.MONGODB_DB = 'luizalabs';

        await mongodb.connect();

        const { body } = await request(app)
            .post('/api/v1/auth')
            .send({ username: 'luizalabs', password: 'luizalabs', role: 'ADMIN' });
        const { token } = body;
        process.env.TOKEN_TEST = token;
    });

    beforeEach(async () => {
        await mongodb.collection('clientes').deleteMany({});
    });

    it('deve registrar um cliente', async done => {
        const { status, body } = await request(app)
            .post(`/api/v1/clientes`)
            .set('Authorization', `${process.env.TOKEN_TEST}`)
            .send({ nome: 'Mock', email: 'mock@email.com' });

        expect(status).toBe(201);

        expect(body).not.toBeNull();
        expect(body).not.toBeUndefined();

        const { id, nome, email } = body;
        expect(id).not.toBeNull();
        expect(id).not.toBeUndefined();

        expect(nome).toBe('Mock');
        expect(email).toBe('mock@email.com');

        done();
    });

    it('deve retornar 400 caso exista um cliente com o mesmo email registrado', async done => {
        const { status, body } = await request(app)
            .post(`/api/v1/clientes`)
            .set('Authorization', `${process.env.TOKEN_TEST}`)
            .send({ nome: 'Mock', email: 'mock@email.com' });

        expect(status).toBe(201);

        expect(body).not.toBeNull();
        expect(body).not.toBeUndefined();

        const { id, nome, email } = body;
        expect(id).not.toBeNull();
        expect(id).not.toBeUndefined();

        expect(nome).toBe('Mock');
        expect(email).toBe('mock@email.com');

        const { status: newStatus } = await request(app)
            .post(`/api/v1/clientes`)
            .set('Authorization', `${process.env.TOKEN_TEST}`)
            .send({ nome: 'Movo Mock', email: 'mock@email.com' });

        expect(newStatus).toBe(400);

        done();
    });

    it('deve retornar 401 caso o token de autenticacao na seja informado', async done => {
        const { status } = await request(app)
            .post(`/api/v1/clientes`)
            .send({ nome: 'Mock', email: 'mock@email.com' });

        expect(status).toBe(401);
        done();
    });
});
