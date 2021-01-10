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

    it('deve retornar 404 caso o cliente nao exista', async done => {
        const { status } = await request(app)
            .delete(`/api/v1/clientes/abc`)
            .set('Authorization', `${process.env.TOKEN_TEST}`);

        expect(status).toBe(404);

        done();
    });

    it('deve remover o cliente', async done => {
        await mongodb
            .collection('clientes')
            .insertOne({ id: 'abc', nome: 'Fulano Silva', email: 'fulano@email.com' });

        const { status } = await request(app)
            .delete(`/api/v1/clientes/abc`)
            .set('Authorization', `${process.env.TOKEN_TEST}`)
            .send({ nome: 'Mock', email: 'mock@email.com' });

        expect(status).toBe(204);

        done();
    });

    it('deve retornar 401 caso o token de autenticacao na seja informado', async done => {
        const { status } = await request(app)
            .delete(`/api/v1/clientes/abc`)
            .send({ nome: 'Mock', email: 'mock@email.com' });

        expect(status).toBe(401);
        done();
    });
});
