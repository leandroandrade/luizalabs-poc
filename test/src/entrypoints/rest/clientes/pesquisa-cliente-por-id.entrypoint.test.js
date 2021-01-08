const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoMemory = new MongoMemoryServer();

const mongodb = require('../../../../../src/configuration/databases/mongodb');
const app = require('../../../../../src/app');

describe('Pesquisa cliente por ID test', () => {
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
        await mongodb.getCollection('clientes').deleteMany({});
    });

    it('deve retornar 404 caso o cliente nao exista', async done => {
        const { status } = await request(app)
            .get('/api/v1/clientes/1')
            .set('Authorization', `${process.env.TOKEN_TEST}`);

        expect(status).toBe(404);
        done();
    });

    it('deve retornar o cliente pelo ID', async done => {
        await mongodb
            .getCollection('clientes')
            .insertOne({ id: '1', nome: 'Fulano Silva', email: 'fulano@email.com' });

        const { status, body } = await request(app)
            .get('/api/v1/clientes/1')
            .set('Authorization', `${process.env.TOKEN_TEST}`);

        expect(status).toBe(200);
        expect(body).not.toBeNull();
        expect(body).not.toBeUndefined();

        const { id, nome, email } = body;
        expect(id).toBe('1');
        expect(nome).toBe('Fulano Silva');
        expect(email).toBe('fulano@email.com');

        done();
    });

    it('deve retornar 401 caso o token de autenticacao na seja informado', async done => {
        const { status } = await request(app).get('/api/v1/clientes/1');

        expect(status).toBe(401);
        done();
    });
});
